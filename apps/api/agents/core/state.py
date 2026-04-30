from typing import Annotated, Sequence, TypedDict
import operator
from langchain_core.messages import BaseMessage

# The core state dictionary for our Multi-Agent graph
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str
    workflow_data: dict
    tenant_id: str
    company_name: str
    company_context: str
    user_id: str
    memory_context: str
