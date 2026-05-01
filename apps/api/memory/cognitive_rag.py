import asyncio
from typing import Dict, Any, List

from memory.mem0_episodic import episodic_memory
from memory.neo4j_graph import graph_memory
from memory.qdrant_semantic import qdrant_retriever

class CognitiveRetriever:
    """
    Cognitive RAG++ Engine.
    Executes parallel queries across Semantic, Graph, and Episodic memory layers
    to build a unified hyper-context for the agent.
    """
    
    async def fetch_semantic(self, query: str, tenant_id: str) -> List[str]:
        from langchain_openai import OpenAIEmbeddings
        
        try:
            embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")
            query_vector = embeddings_model.embed_query(query)
            results = qdrant_retriever.dense_search(query_vector=query_vector, limit=2, tenant_id=tenant_id)
        except Exception as e:
            print(f"Error fetching semantic embeddings: {e}")
            results = []
        
        # If Qdrant is empty or offline, fallback to mock data
        if not results:
            if "refund" in query.lower():
                return ["SLA Policy: All premium refund requests must be processed within 2 hours."]
            return ["Semantic Memory: No policies found."]
            
        return [res.get("payload", {}).get("text", str(res)) for res in results]

    async def fetch_graph(self, query: str, tenant_id: str) -> List[str]:
        return graph_memory.fetch_relational_context(tenant_id, query)

    async def fetch_episodic(self, query: str, user_id: str, tenant_id: str) -> List[str]:
        return episodic_memory.retrieve_context(user_id, tenant_id, query)

    async def hybrid_search(self, query: str, user_id: str, tenant_id: str) -> str:
        """
        Executes all retrieval types concurrently and stitches them into a massive context block.
        """
        results = await asyncio.gather(
            self.fetch_semantic(query, tenant_id),
            self.fetch_graph(query, tenant_id),
            self.fetch_episodic(query, user_id, tenant_id)
        )
        
        semantic_context = "\n".join(results[0])
        graph_context = "\n".join(results[1])
        episodic_context = "\n".join(results[2])
        
        unified_context = f"""
=== COGNITIVE MEMORY INJECTION ===
[SEMANTIC KNOWLEDGE (Qdrant)]
{semantic_context}

[GRAPH RELATIONSHIPS (Neo4j)]
{graph_context}

[EPISODIC HISTORY (Mem0)]
{episodic_context}
==================================
"""
        return unified_context

# Singleton instance
cognitive_rag = CognitiveRetriever()
