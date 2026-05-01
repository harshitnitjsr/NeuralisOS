import os
from neo4j import GraphDatabase

class Neo4jClient:
    """
    Graph Memory layer using Neo4j.
    Stores and retrieves relational context (dependencies, organizational structures).
    """
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")
        
        try:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            self.driver.verify_connectivity()
        except Exception as e:
            print(f"Warning: Neo4j connection failed. {e}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def fetch_relational_context(self, tenant_id: str, query: str) -> list[str]:
        """
        Extracts relevant subgraphs based on the user's query.
        """
        if not self.driver:
            return ["Graph Memory is offline."]
            
        real_results = []
        try:
            with self.driver.session() as session:
                result = session.run(
                    "MATCH (o:Organization {id: $tenant_id})-[:OWNS]->(d:Document) RETURN d.name as filename, d.content as content LIMIT 5",
                    tenant_id=tenant_id
                )
                for record in result:
                    real_results.append(f"Document Knowledge Graph -> (File: {record['filename']}): {record['content']}")
        except Exception as e:
            print(f"Error fetching graph memory from Neo4j: {e}")

        # In a real system, you would use an LLM or Graphiti to extract entities from the query
        # and then run an optimized Cypher query.
        # Here we simulate fetching relational paths.
        
        simulated_results = []
        if "api" in query.lower() or "server" in query.lower():
            simulated_results.append("(API Gateway) -[DEPENDS_ON]-> (PostgreSQL Database)")
        if "refund" in query.lower():
            simulated_results.append("(User) -[PURCHASED]-> (Enterprise Plan) -[ELIGIBLE_FOR]-> (Refund)")
            
        return real_results + simulated_results

graph_memory = Neo4jClient()
