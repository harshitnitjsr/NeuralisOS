import random
from uuid import uuid4
from openenv.core.env_server.interfaces import Environment
from openenv.core.env_server.types import State

from .models import SupportAction, SupportObservation

class SupportEnvironment(Environment):
    def __init__(self):
        self._state = State(episode_id=str(uuid4()), step_count=0)
        self._customer_emotion = random.uniform(0.0, 1.0)
        self._sla = 24.0
        self._history = 0

    def reset(self) -> SupportObservation:
        self._state = State(episode_id=str(uuid4()), step_count=0)
        self._customer_emotion = random.uniform(0.0, 1.0)
        self._sla = 24.0
        self._history = 0
        
        return SupportObservation(
            customer_emotion=self._customer_emotion,
            sla_time_remaining=self._sla,
            ticket_history_length=self._history,
            result="New customer ticket initialized.",
            success=True,
            done=False,
            reward=0.0
        )

    def step(self, action: SupportAction) -> SupportObservation:
        self._state.step_count += 1
        self._history += 1
        self._sla -= 1.0
        
        reward = 0.0
        done = False
        result_msg = ""
        
        if action.command == "reply":
            reward += 0.5
            if self._customer_emotion > 0.8:
                reward += 1.0
                result_msg = "Successfully de-escalated angry customer."
                done = True
            else:
                result_msg = "Replied to customer."
        elif action.command == "escalate":
            reward -= 0.2
            result_msg = "Ticket escalated to human agent."
            done = True
        elif action.command == "refund":
            if self._sla < 2.0:
                reward += 0.8
                result_msg = "Refund issued near SLA breach."
            else:
                reward -= 1.0
                result_msg = "Refund issued prematurely."
            done = True
            
        self._customer_emotion = max(0.0, self._customer_emotion - 0.2)
        
        return SupportObservation(
            customer_emotion=self._customer_emotion,
            sla_time_remaining=self._sla,
            ticket_history_length=self._history,
            result=result_msg,
            success=True,
            done=done,
            reward=reward
        )

    @property
    def state(self) -> State:
        return self._state
