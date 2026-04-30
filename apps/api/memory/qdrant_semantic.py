from typing import List, Dict, Any, Optional
from qdrant_client.http import models
from core.db import qdrant_client

class QdrantRetriever:
    """
    Handles advanced retrieval operations for Semantic Memory using Qdrant.
    Supports Dense, Sparse, and Hybrid searches.
    """
    
    def __init__(self, collection_name: str = "aetheros_semantic"):
        self.client = qdrant_client
        self.collection_name = collection_name
        self.vector_name = "dense" # Default named vector for dense embeddings
        self.sparse_vector_name = "sparse" # Default named vector for sparse embeddings
        
    def dense_search(self, query_vector: List[float], limit: int = 5, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Standard Vector Search (Dense).
        Matches semantic meaning using cosine/dot-product distance.
        """
        if not self.client:
            return []
            
        filter_params = None
        if tenant_id:
            filter_params = models.Filter(
                must=[models.FieldCondition(key="tenant_id", match=models.MatchValue(value=tenant_id))]
            )
            
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit,
            query_filter=filter_params,
            with_payload=True
        )
        return [{"id": point.id, "score": point.score, "payload": point.payload} for point in results]

    def sparse_search(self, query_indices: List[int], query_values: List[float], limit: int = 5, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Sparse Vector Search (BM25 / Splade).
        Matches exact keywords efficiently.
        """
        if not self.client:
            return []

        filter_params = None
        if tenant_id:
            filter_params = models.Filter(
                must=[models.FieldCondition(key="tenant_id", match=models.MatchValue(value=tenant_id))]
            )
            
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=models.NamedSparseVector(
                name=self.sparse_vector_name,
                vector=models.SparseVector(
                    indices=query_indices,
                    values=query_values
                )
            ),
            limit=limit,
            query_filter=filter_params,
            with_payload=True
        )
        return [{"id": point.id, "score": point.score, "payload": point.payload} for point in results]

    def hybrid_search(self, dense_query_vector: List[float], sparse_indices: List[int], sparse_values: List[float], limit: int = 5, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Hybrid Search (Dense + Sparse).
        Uses Qdrant's Reciprocal Rank Fusion (RRF) to combine semantic and keyword relevance.
        """
        if not self.client:
            return []

        filter_params = None
        if tenant_id:
            filter_params = models.Filter(
                must=[models.FieldCondition(key="tenant_id", match=models.MatchValue(value=tenant_id))]
            )

        # In newer Qdrant versions, we use the `query_points` API for multi-vector fusion
        # If running an older version, we fall back to a manual two-step fetch or batch_search.
        try:
            results = self.client.query_points(
                collection_name=self.collection_name,
                prefetch=[
                    models.Prefetch(
                        query=dense_query_vector,
                        using=self.vector_name,
                        limit=limit * 2
                    ),
                    models.Prefetch(
                        query=models.SparseVector(indices=sparse_indices, values=sparse_values),
                        using=self.sparse_vector_name,
                        limit=limit * 2
                    )
                ],
                query=models.FusionQuery(fusion=models.Fusion.RRF),
                limit=limit,
                query_filter=filter_params,
                with_payload=True
            )
            return [{"id": point.id, "score": point.score, "payload": point.payload} for point in results.points]
        except Exception as e:
            print(f"Hybrid search failed (likely missing Fusion API support): {e}")
            return self.dense_search(dense_query_vector, limit, tenant_id)

qdrant_retriever = QdrantRetriever()
