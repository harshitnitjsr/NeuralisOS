from pydantic import Field
from openenv.core.env_server.types import Action, Observation

class SupportAction(Action):
    """
    Action space for the Support Environment.
    Command maps to standard discrete actions: 'reply', 'escalate', 'refund'.
    """
    command: str = Field(..., description="Command to execute: 'reply', 'escalate', or 'refund'")
    parameters: dict = Field(default_factory=dict, description="Command parameters")

class SupportObservation(Observation):
    """
    Observation space returning the state of the customer interaction.
    """
    customer_emotion: float = Field(..., description="Customer anger/frustration score (0-1)")
    sla_time_remaining: float = Field(..., description="SLA remaining in hours")
    ticket_history_length: int = Field(..., description="Number of previous messages")
    result: str = Field(..., description="System result text")
    success: bool = Field(..., description="Whether the action succeeded")
