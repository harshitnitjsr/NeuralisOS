from core.telemetry import track_agent_execution
from agents.core.state import AgentState
from agents.tasks.tools import ALL_TOOLS
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0).bind_tools(ALL_TOOLS)

def get_support_prompt(company_name: str, context: str) -> str:
    return f"""You are the Support Agent for {company_name}.
Company Context: {context}
Your role is to handle customer inquiries, process refunds, and explain SLAs.
You have access to the lookup_internal_policy tool.
"""

@track_agent_execution(agent_name="support_agent")
async def support_agent_node(state: AgentState):
    company = state.get("company_name", "a generic company")
    context = state.get("company_context", "")
    print(f"[{company}] Support Agent processing request...")
    
    messages = state["messages"]
    sys_msg = SystemMessage(content=get_support_prompt(company, context))
    
    try:
        response = await llm.ainvoke([sys_msg] + list(messages))
        return {"messages": [response]}
    except Exception as e:
        return {"messages": [{"role": "assistant", "content": "Support Agent is currently unavailable."}]}
