from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.graph import run_multi_agent_workflow
import traceback

router = APIRouter(prefix="/agents", tags=["agents"])

class ChatRequest(BaseModel):
    query: str
    tenant_id: str = "default_tenant"
    user_id: str = "default_user"
    company_name: str = "NeuralisOS"
    company_context: str = ""

@router.get("/")
async def list_agents():
    # Mock data for Phase 2 implementation
    return {
        "agents": [
            {"name": "Support Agent", "role": "Customer Success", "status": "Active"},
            {"name": "DevOps Overseer", "role": "Infrastructure", "status": "Active"},
            {"name": "Supervisor Agent", "role": "Cognitive Coordination", "status": "Active"}
        ]
    }

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        final_state = await run_multi_agent_workflow(
            user_input=request.query,
            tenant_id=request.tenant_id,
            user_id=request.user_id,
            company_name=request.company_name,
            company_context=request.company_context
        )
        
        # Extract the last message from the assistant
        messages = final_state.get("messages", [])
        if messages:
            last_message_obj = messages[-1]
            if isinstance(last_message_obj, dict):
                last_message = last_message_obj.get("content", str(last_message_obj))
            else:
                last_message = last_message_obj.content
        else:
            last_message = "No response generated."
            
        return {
            "response": last_message,
            "next_agent": final_state.get("next_agent", "unknown")
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

