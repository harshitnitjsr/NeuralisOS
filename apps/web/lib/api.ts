const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error("API not healthy");
    return await res.json();
  } catch (error) {
    console.error("Health check failed:", error);
    return null;
  }
}

export async function fetchAgents() {
  try {
    const res = await fetch(`${API_URL}/agents`);
    if (!res.ok) throw new Error("Failed to fetch agents");
    const data = await res.json();
    return data.agents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchMemoryActivity() {
  try {
    const res = await fetch(`${API_URL}/memory/activity`);
    if (!res.ok) throw new Error("Failed to fetch memory activity");
    const data = await res.json();
    return data.activity;
  } catch (error) {
    console.error(error);
    return [];
  }
}
