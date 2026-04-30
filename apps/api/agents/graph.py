from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage

from agents.core.state import AgentState
from agents.tasks.tools import ALL_TOOLS

# Import Cognitive Agents
from agents.cognitive.supervisor import supervisor_node
from agents.cognitive.critic import critic_node

# Import Role Agents
from agents.roles.support import support_agent_node
from agents.roles.devops import devops_agent_node
from agents.roles.sales import sales_agent_node
from agents.roles.finance import finance_agent_node
from agents.roles.legal import legal_agent_node
from agents.roles.hr import hr_agent_node
from agents.roles.marketing import marketing_agent_node

# 1. Initialize Graph
workflow = StateGraph(AgentState)

# 2. Add Nodes
workflow.add_node("Supervisor", supervisor_node)
workflow.add_node("Critic", critic_node)

# Role Nodes
workflow.add_node("Support", support_agent_node)
workflow.add_node("DevOps", devops_agent_node)
workflow.add_node("Sales", sales_agent_node)
workflow.add_node("Finance", finance_agent_node)
workflow.add_node("Legal", legal_agent_node)
workflow.add_node("HR", hr_agent_node)
workflow.add_node("Marketing", marketing_agent_node)

# Task Node (Tool Execution)
tool_node = ToolNode(ALL_TOOLS)
workflow.add_node("Tools", tool_node)

# 3. Define Edges

# Supervisor routes to Role Agents
workflow.add_conditional_edges(
    "Supervisor",
    lambda x: x["next_agent"],
    {
        "Support": "Support",
        "DevOps": "DevOps",
        "Sales": "Sales",
        "Finance": "Finance",
        "Legal": "Legal",
        "HR": "HR",
        "Marketing": "Marketing",
        END: END
    }
)

# Helper function to decide if a tool was called by the agent
def should_continue(state: AgentState) -> str:
    messages = state.get("messages", [])
    if not messages:
        return "Critic"
    last_message = messages[-1]
    
    # If there is a tool call, route to the Tools node
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        # Check if the tool_calls is actually a list of calls
        return "Tools"
    
    # Fallback to check if it's a raw dict
    if isinstance(last_message, dict) and last_message.get("tool_calls"):
        return "Tools"

    # Otherwise route to Critic for final review
    return "Critic"

# All role agents conditionally route to either Tools or Critic
role_agents = ["Support", "DevOps", "Sales", "Finance", "Legal", "HR", "Marketing"]

for agent in role_agents:
    workflow.add_conditional_edges(
        agent,
        should_continue,
        {
            "Tools": "Tools",
            "Critic": "Critic"
        }
    )

# Tools return their output to Critic (or they could return to the Agent, but for simplicity we go to Critic)
workflow.add_edge("Tools", "Critic")

# Critic ends the workflow
workflow.add_edge("Critic", END)

# Set entry point
workflow.set_entry_point("Supervisor")

# Compile
orchestrator_app = workflow.compile()

# Helper function to trigger a workflow run
async def run_multi_agent_workflow(user_input: str, tenant_id: str = "default_tenant", user_id: str = "default_user", company_name: str = "NeuralisOS", company_context: str = ""):
    state = {
        "messages": [HumanMessage(content=user_input)], 
        "workflow_data": {},
        "tenant_id": tenant_id,
        "user_id": user_id,
        "company_name": company_name,
        "company_context": company_context,
        "memory_context": ""
    }
    final_state = await orchestrator_app.ainvoke(state)
    return final_state
