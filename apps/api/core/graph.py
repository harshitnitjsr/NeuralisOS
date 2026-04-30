import os
from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

class OrganizationalKnowledgeGraph:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def record_agent_interaction(self, source_agent: str, target_agent: str, interaction_type: str):
        """
        Maps the communication flow between agents in the organization.
        """
        with self.driver.session() as session:
            session.run(
                '''
                MERGE (a:Agent {name: $source})
                MERGE (b:Agent {name: $target})
                MERGE (a)-[r:INTERACTED_WITH {type: $interaction_type, timestamp: datetime()}]->(b)
                ''',
                source=source_agent,
                target=target_agent,
                interaction_type=interaction_type
            )

    def record_workflow_dependency(self, workflow_name: str, depends_on: str):
        """
        Maps workflow dependencies for autonomous orchestration.
        """
        with self.driver.session() as session:
            session.run(
                '''
                MERGE (w:Workflow {name: $workflow})
                MERGE (d:System {name: $dependency})
                MERGE (w)-[r:DEPENDS_ON]->(d)
                ''',
                workflow=workflow_name,
                dependency=depends_on
            )

try:
    graph_memory = OrganizationalKnowledgeGraph(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)
except Exception as e:
    graph_memory = None
    print(f"Warning: Neo4j connection failed. {e}")
