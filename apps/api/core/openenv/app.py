from openenv.core.env_server import create_app
from .models import SupportAction, SupportObservation
from .environment import SupportEnvironment

# Pass the class (factory) - each WebSocket session gets its own instance
app = create_app(SupportEnvironment, SupportAction, SupportObservation, env_name="support_env")
