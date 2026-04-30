import os
import redis
import sqlalchemy
from qdrant_client import QdrantClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Configuration
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://aether:password@localhost:5432/aetheros")
QDRANT_URL = os.getenv("QDRANT_URL", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# 1. PostgreSQL (Episodic Memory)
engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EpisodicMemory(Base):
    __tablename__ = "episodic_memories"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, index=True)
    agent_id = sqlalchemy.Column(sqlalchemy.String, index=True)
    action_type = sqlalchemy.Column(sqlalchemy.String)
    content = sqlalchemy.Column(sqlalchemy.Text)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, default=sqlalchemy.sql.func.now())

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. Qdrant (Semantic Memory)
try:
    qdrant_client = QdrantClient(host=QDRANT_URL, port=QDRANT_PORT)
    # Ensure collection exists
    collections = [c.name for c in qdrant_client.get_collections().collections]
    if "aetheros_semantic" not in collections:
        from qdrant_client.http.models import Distance, VectorParams
        qdrant_client.create_collection(
            collection_name="aetheros_semantic",
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
except Exception as e:
    qdrant_client = None
    print(f"Warning: Qdrant connection failed. {e}")

def insert_semantic_memory(text: str, vector: list[float], metadata: dict):
    if qdrant_client:
        from qdrant_client.http.models import PointStruct
        import uuid
        point = PointStruct(id=str(uuid.uuid4()), vector=vector, payload={"text": text, **metadata})
        qdrant_client.upsert(collection_name="aetheros_semantic", points=[point])


# 3. Redis (Real-time Caching and Memory Event Streams)
try:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
except Exception as e:
    print(f"Warning: Redis connection failed. {e}")
