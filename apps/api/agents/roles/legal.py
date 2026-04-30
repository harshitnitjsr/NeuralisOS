from core.telemetry import track_agent_execution
from agents.core.state import AgentState
from agents.tasks.tools import ALL_TOOLS
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0).bind_tools(ALL_TOOLS)

def get_legal_prompt(company_name: str, context: str) -> str:
    return f"""You are the Legal Agent for {company_name}.
Company Context: {context}
Your role is to draft clauses, review compliance, and generate NDAs.
You have access to the draft_legal_clause tool.
"""

@track_agent_execution(agent_name="legal_agent")
async def legal_agent_node(state: AgentState):
    company = state.get("company_name", "a generic company")
    context = state.get("company_context", "")
    print(f"[{company}] Agent processing request...")
    
    messages = state["messages"]
    sys_msg = SystemMessage(content=get_legal_prompt(company, context))
    
    try:
        response = await llm.ainvoke([sys_msg] + list(messages))
        return {"messages": [response]}
    except Exception as e:
        return {"messages": [{"role": "assistant", "content": "Agent is currently unavailable."}]}
