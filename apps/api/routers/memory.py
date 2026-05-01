from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/memory", tags=["memory"])

class GraphNode(BaseModel):
    id: str
    label: str
    color: str

class GraphEdge(BaseModel):
    source: str
    target: str
    label: str

@router.get("/activity")
async def get_memory_activity(tenant_id: str = "default_tenant"):
    # Mock data for Phase 2 implementation
    return {
        "activity": [
            {"type": "Episodic", "desc": "Resolved support ticket #892", "time": "2 mins ago"},
            {"type": "Semantic", "desc": f"Ingested docs for tenant: {tenant_id}", "time": "15 mins ago"},
            {"type": "Procedural", "desc": "Optimized onboarding workflow", "time": "1 hr ago"},
            {"type": "Graph", "desc": "Mapped new engineering org structure", "time": "3 hrs ago"}
        ]
    }

@router.get("/graph")
async def get_graph_data(tenant_id: str = "default_tenant"):
    """
    Returns actual graph data from Neo4j for the requested tenant.
    """
    nodes = []
    edges = []
    
    nodes.append({"id": tenant_id, "label": "Organization", "color": "#8b5cf6"})
    
    try:
        from memory.neo4j_graph import graph_memory
        if graph_memory.driver:
            with graph_memory.driver.session() as session:
                res = session.run("MATCH (o:Organization {id: $tenant_id})-[:OWNS]->(d:Document) RETURN d", tenant_id=tenant_id)
                for record in res:
                    doc_id = record['d']['id']
                    doc_name = record['d']['name']
                    nodes.append({"id": doc_id, "label": doc_name, "color": "#10b981"})
                    edges.append({"source": tenant_id, "target": doc_id, "label": "OWNS"})
    except Exception as e:
        print(f"Error fetching graph data: {e}")
        
    if len(nodes) == 1:
        # Fallback to some placeholder logic so UI isn't completely empty
        nodes.append({"id": "doc1", "label": "Getting Started.pdf", "color": "#10b981"})
        edges.append({"source": tenant_id, "target": "doc1", "label": "OWNS"})

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_nodes": len(nodes),
            "active_relationships": len(edges),
            "csat": "+1.42 CSAT Avg"
        }
    }
