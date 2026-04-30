from langchain_core.tools import tool

@tool
def calculate_math(expression: str) -> str:
    """
    Evaluates a simple math expression.
    Use this for basic arithmetic.
    """
    try:
        # Extremely simple and safe math evaluation for demo purposes
        result = eval(expression, {"__builtins__": None}, {})
        return str(result)
    except Exception as e:
        return f"Error calculating: {e}"

@tool
def lookup_internal_policy(query: str) -> str:
    """
    Looks up internal company policies or SLAs.
    Use this when a customer asks about refunds, warranties, etc.
    """
    if "refund" in query.lower():
        return "SLA Policy: Refunds are processed within 3-5 business days."
    return "Policy not found."

@tool
def check_server_status(service_name: str) -> str:
    """
    Checks the real-time status of a microservice.
    Use this when diagnosing DevOps incidents.
    """
    if "api" in service_name.lower():
        return "API Gateway is ONLINE. 5 replicas running."
    return f"Service {service_name} is UNKNOWN."

@tool
def calculate_tax(amount: float, region: str) -> str:
    """
    Calculates tax for a financial transaction.
    """
    return f"Tax for {amount} in {region} is {amount * 0.15}"

@tool
def draft_legal_clause(clause_type: str) -> str:
    """
    Drafts a standard legal clause.
    """
    return f"Standard clause for {clause_type}: Liability is limited to $100."

# We group these tools into a list to pass to the LangGraph ToolNode
ALL_TOOLS = [calculate_math, lookup_internal_policy, check_server_status, calculate_tax, draft_legal_clause]
