from core.telemetry import track_agent_execution
from memory.cognitive_rag import cognitive_rag
from agents.core.state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0)

def get_supervisor_prompt(company_name: str, context: str, memory: str) -> str:
    return f"""You are the Cognitive Supervisor for {company_name}.
Company Context: {context}
Memory Context: {memory}
Your role is to route requests to the correct functional agent.
Respond with EXACTLY ONE word matching one of these agents:
Support, DevOps, Sales, Finance, Legal, HR, Marketing
"""

@track_agent_execution(agent_name="supervisor_agent")
async def supervisor_node(state: AgentState):
    company = state.get("company_name", "a generic company")
    tenant_id = state.get("tenant_id", "default_tenant")
    user_id = state.get("user_id", "default_user")
    context = state.get("company_context", "")
    
    print(f"[{company}] Supervisor executing Cognitive RAG++ search...")
    last_msg = state["messages"][-1].content
    
    try:
        # Fetch the unified context block from Mem0 + Neo4j + Qdrant
        unified_context = await cognitive_rag.hybrid_search(last_msg, user_id, tenant_id)
        state["memory_context"] = unified_context
        print("Memory Context Injected!")
    except Exception as e:
        print(f"RAG search failed: {e}")
        state["memory_context"] = "Memory retrieval failed."
    
    # LLM Router
    system_msg = get_supervisor_prompt(company, context, state["memory_context"])
    try:
        response = await llm.ainvoke([SystemMessage(content=system_msg), HumanMessage(content=last_msg)])
        next_agent = response.content.strip().strip("'\"*").capitalize()
    except Exception:
        next_agent = "Support"

    valid_agents = ["Support", "DevOps", "Sales", "Finance", "Legal", "HR", "Marketing"]
    if next_agent not in valid_agents:
        next_agent = "Support"
        
    return {"next_agent": next_agent}
