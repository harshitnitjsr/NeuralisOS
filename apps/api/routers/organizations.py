import os
import uuid
import json
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/organizations", tags=["organizations"])

# ─────────────────────────────────────────────────────────────
# In-memory store (swap for Postgres in production)
# ─────────────────────────────────────────────────────────────
_ORGS: dict = {}
_DOCS: dict = {}   # org_id -> list of doc metadata


class OrgCreate(BaseModel):
    name: str
    description: str = ""
    industry: str = ""
    agents_enabled: list[str] = ["Support", "DevOps", "Sales", "Finance", "Legal", "HR", "Marketing"]


class OrgOut(BaseModel):
    id: str
    name: str
    description: str
    industry: str
    document_count: int
    agents_enabled: list[str]


# ─────────────────────────────────────────────────────────────
# Organization CRUD
# ─────────────────────────────────────────────────────────────

@router.get("/", response_model=list[OrgOut])
async def list_organizations():
    result = []
    for org_id, org in _ORGS.items():
        docs = _DOCS.get(org_id, [])
        result.append(OrgOut(
            id=org_id,
            name=org["name"],
            description=org["description"],
            industry=org["industry"],
            document_count=len(docs),
            agents_enabled=org.get("agents_enabled", []),
        ))
    return result


@router.post("/", response_model=OrgOut)
async def create_organization(body: OrgCreate):
    org_id = str(uuid.uuid4())
    # If UI doesn't send agents_enabled, it defaults to the list in OrgCreate
    _ORGS[org_id] = {
        "name": body.name,
        "description": body.description,
        "industry": body.industry,
        "agents_enabled": body.agents_enabled,
    }
    _DOCS[org_id] = []
    return OrgOut(
        id=org_id,
        name=body.name,
        description=body.description,
        industry=body.industry,
        document_count=0,
        agents_enabled=body.agents_enabled,
    )


@router.get("/{org_id}", response_model=OrgOut)
async def get_organization(org_id: str):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")
    org = _ORGS[org_id]
    docs = _DOCS.get(org_id, [])
    return OrgOut(
        id=org_id,
        name=org["name"],
        description=org["description"],
        industry=org["industry"],
        document_count=len(docs),
        agents_enabled=org["agents_enabled"],
    )


@router.delete("/{org_id}")
async def delete_organization(org_id: str):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")
    del _ORGS[org_id]
    _DOCS.pop(org_id, None)
    return {"status": "deleted"}


# ─────────────────────────────────────────────────────────────
# Document Upload & Retrieval
# ─────────────────────────────────────────────────────────────

@router.get("/{org_id}/documents")
async def list_documents(org_id: str):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"documents": _DOCS.get(org_id, [])}


@router.post("/{org_id}/documents")
async def upload_document(org_id: str, file: UploadFile = File(...)):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")

    content = await file.read()
    doc_id = str(uuid.uuid4())
    text = ""

    # Attempt to extract text (txt / basic handling)
    try:
        text = content.decode("utf-8", errors="ignore")
    except Exception:
        text = ""

    doc_meta = {
        "id": doc_id,
        "filename": file.filename,
        "size_bytes": len(content),
        "content_type": file.content_type,
        "text_preview": text[:300],
    }

    _DOCS.setdefault(org_id, []).append(doc_meta)

    # ── Index text into Qdrant under this org's tenant namespace ──
    try:
        from memory.qdrant_semantic import qdrant_retriever
        from core.db import qdrant_client, insert_semantic_memory
        from langchain_openai import OpenAIEmbeddings

        if text and qdrant_client:
            embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")
            # Chunking could be more robust, but using the first 2000 chars for now
            chunk = text[:2000]
            vector = embeddings_model.embed_query(chunk)
            insert_semantic_memory(
                text=chunk,
                vector=vector,
                metadata={"tenant_id": org_id, "filename": file.filename, "doc_id": doc_id}
            )
    except Exception as e:
        print(f"Warning: Qdrant indexing failed – {e}")

    # ── Index text into Neo4j Graph DB under this org's tenant namespace ──
    try:
        from memory.neo4j_graph import graph_memory
        if text and graph_memory.driver:
            with graph_memory.driver.session() as session:
                # Basic node creation for uploaded document to knowledge graph
                session.run(
                    "MERGE (o:Organization {id: $org_id}) "
                    "MERGE (d:Document {id: $doc_id, name: $filename}) "
                    "MERGE (o)-[:OWNS]->(d) "
                    "SET d.content = $text",
                    org_id=org_id, doc_id=doc_id, filename=file.filename, text=text[:500]
                )
    except Exception as e:
        print(f"Warning: Neo4j indexing failed - {e}")

    return {"status": "uploaded", "document": doc_meta}


@router.delete("/{org_id}/documents/{doc_id}")
async def delete_document(org_id: str, doc_id: str):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")
    docs = _DOCS.get(org_id, [])
    _DOCS[org_id] = [d for d in docs if d["id"] != doc_id]
    return {"status": "deleted"}
