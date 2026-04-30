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
            agents_enabled=org["agents_enabled"],
        ))
    return result


@router.post("/", response_model=OrgOut)
async def create_organization(body: OrgCreate):
    org_id = str(uuid.uuid4())
    _ORGS[org_id] = {
        "name": body.name,
        "description": body.description,
        "industry": body.industry,
        "agents_enabled": ["Support", "DevOps", "Sales", "Finance", "Legal", "HR", "Marketing"],
    }
    _DOCS[org_id] = []
    return OrgOut(
        id=org_id,
        name=body.name,
        description=body.description,
        industry=body.industry,
        document_count=0,
        agents_enabled=["Support", "DevOps", "Sales", "Finance", "Legal", "HR", "Marketing"],
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
        if text and qdrant_client:
            dummy_vector = [0.0] * 1536   # Replace with real embedding in production
            insert_semantic_memory(
                text=text[:2000],
                vector=dummy_vector,
                metadata={"tenant_id": org_id, "filename": file.filename, "doc_id": doc_id}
            )
    except Exception as e:
        print(f"Warning: Qdrant indexing failed – {e}")

    return {"status": "uploaded", "document": doc_meta}


@router.delete("/{org_id}/documents/{doc_id}")
async def delete_document(org_id: str, doc_id: str):
    if org_id not in _ORGS:
        raise HTTPException(status_code=404, detail="Organization not found")
    docs = _DOCS.get(org_id, [])
    _DOCS[org_id] = [d for d in docs if d["id"] != doc_id]
    return {"status": "deleted"}
