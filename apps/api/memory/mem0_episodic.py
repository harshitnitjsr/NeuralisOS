import os
from mem0 import Memory

class Mem0Client:
    """
    Episodic Memory layer using Mem0.
    Stores and retrieves long-term conversation context, user preferences, and past mistakes.
    Uses local storage (Chroma/SQLite) to avoid requiring API keys for now.
    """
    def __init__(self):
        # Configure Mem0 to use local Chroma DB and SQLite for metadata
        # so it doesn't require cloud API keys.
        config = {
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "host": os.getenv("QDRANT_URL", "localhost"),
                    "port": int(os.getenv("QDRANT_PORT", "6333")),
                    "collection_name": "aetheros_mem0_episodic"
                }
            }
        }
        try:
            self.memory = Memory.from_config(config)
        except Exception as e:
            print(f"Warning: Mem0 initialization failed. {e}")
            self.memory = None

    def store_context(self, user_id: str, tenant_id: str, text: str):
        if not self.memory:
            return
        
        # Combine tenant and user for isolation
        mem_id = f"{tenant_id}_{user_id}"
        self.memory.add(text, user_id=mem_id)

    def retrieve_context(self, user_id: str, tenant_id: str, query: str) -> list[str]:
        if not self.memory:
            return ["Mem0 Episodic Memory is offline."]
        
        mem_id = f"{tenant_id}_{user_id}"
        results = self.memory.search(query, user_id=mem_id)
        
        # Extract the semantic memories
        if not results:
            return []
            
        return [res.get('text', str(res)) for res in results]

episodic_memory = Mem0Client()
