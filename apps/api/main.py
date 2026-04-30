from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
from pydantic_settings import BaseSettings
from routers import agents, memory, organizations

class Settings(BaseSettings):
    project_name: str = "NeuralisOS"
    version: str = "0.1.0"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

app = FastAPI(
    title=settings.project_name,
    version=settings.version,
    description="The Operating System for Autonomous AI Organizations",
)

# Allow CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router)
app.include_router(memory.router)
app.include_router(organizations.router)

# Expose Prometheus Metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "NeuralisOS API Gateway",
        "version": settings.version
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "memory_engine": "initializing", "agents": "standby"}