from fastapi import APIRouter

router = APIRouter(prefix="/memory", tags=["memory"])

@router.get("/activity")
async def get_memory_activity():
    # Mock data for Phase 2 implementation
    return {
        "activity": [
            {"type": "Episodic", "desc": "Resolved support ticket #892", "time": "2 mins ago"},
            {"type": "Semantic", "desc": "Ingested new API documentation", "time": "15 mins ago"},
            {"type": "Procedural", "desc": "Optimized onboarding workflow", "time": "1 hr ago"},
            {"type": "Graph", "desc": "Mapped new engineering org structure", "time": "3 hrs ago"}
        ]
    }
