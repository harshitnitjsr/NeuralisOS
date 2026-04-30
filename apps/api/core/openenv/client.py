from openenv.core.env_client import EnvClient
from openenv.core.client_types import StepResult
from openenv.core.env_server.types import State
from .models import SupportAction, SupportObservation

class SupportEnvClient(EnvClient[SupportAction, SupportObservation, State]):
    def _step_payload(self, action: SupportAction) -> dict:
        return {"command": action.command, "parameters": action.parameters}

    def _parse_result(self, payload: dict) -> StepResult[SupportObservation]:
        obs_data = payload.get("observation", {})
        obs = SupportObservation(
            customer_emotion=obs_data.get("customer_emotion", 0.0),
            sla_time_remaining=obs_data.get("sla_time_remaining", 0.0),
            ticket_history_length=obs_data.get("ticket_history_length", 0),
            result=obs_data.get("result", ""),
            success=obs_data.get("success", False),
            done=payload.get("done", False),
            reward=payload.get("reward", 0.0)
        )
        return StepResult(
            observation=obs,
            reward=payload.get("reward", 0.0),
            done=payload.get("done", False)
        )

    def _parse_state(self, payload: dict) -> State:
        return State(
            episode_id=payload.get("episode_id", ""),
            step_count=payload.get("step_count", 0)
        )
