from prometheus_client import Counter, Histogram, Gauge
import time
from functools import wraps

# Define Prometheus Metrics
AGENT_EXECUTION_TIME = Histogram(
    'agent_execution_time_seconds',
    'Time spent executing an agent node',
    ['agent_name']
)

TOKENS_CONSUMED = Counter(
    'tokens_consumed_total',
    'Total LLM tokens consumed',
    ['model', 'agent_name']
)

HALLUCINATION_INCIDENTS = Counter(
    'hallucination_incidents_total',
    'Number of detected hallucinations blocked by the Critic/Evaluator',
    ['agent_name']
)

ACTIVE_WORKFLOWS = Gauge(
    'active_workflows',
    'Number of currently executing multi-agent workflows'
)

def track_agent_execution(agent_name: str):
    """
    Decorator to wrap LangGraph agent nodes with Prometheus telemetry.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                execution_time = time.time() - start_time
                AGENT_EXECUTION_TIME.labels(agent_name=agent_name).observe(execution_time)
                
                # Simulate token counting (for demonstration)
                TOKENS_CONSUMED.labels(model="llama-3", agent_name=agent_name).inc(150)
        return wrapper
    return decorator
