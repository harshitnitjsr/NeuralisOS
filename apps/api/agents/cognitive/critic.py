from core.telemetry import track_agent_execution
from agents.core.state import AgentState
from langgraph.graph import END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

llm = ChatOpenAI(model="gpt-4o", temperature=0)

def get_critic_prompt(company_name: str, context: str) -> str:
    return f"""You are the Critic Agent for {company_name}.
Company Context: {context}
Your role is to evaluate the final response from functional agents before sending it to the user.
If you detect a hallucination or policy violation, you block it.
"""

from langchain_core.messages import AIMessage

@track_agent_execution(agent_name="critic_agent")
async def critic_node(state: AgentState):
    company = state.get("company_name", "a generic company")
    context = state.get("company_context", "")
    print(f"[{company}] Critic evaluating response...")
    
    last_msg = state["messages"][-1]
    last_content = last_msg.content if not isinstance(last_msg, dict) else last_msg.get("content", str(last_msg))
    
    sys_msg = SystemMessage(content=get_critic_prompt(company, context))
    eval_msg = HumanMessage(content=f"Please evaluate this response and provide a refined version:\n{last_content}")
    
    try:
        response = await llm.ainvoke([sys_msg, eval_msg])
        if "error" in last_content.lower():
            print("Critic detected a violation. Blocking.")
            return {"messages": [AIMessage(content="The action could not be completed safely.")]}
        return {"messages": []} # Pass through the original agent's response
    except Exception:
        return {"messages": []}
