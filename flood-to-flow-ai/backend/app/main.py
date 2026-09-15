"""
FastAPI Main Application Entrypoint for Flood-to-Flow AI.
Offline Disaster Intelligence Copilot for Snapdragon-powered HP AI PCs.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.database import engine, Base, SessionLocal
from backend.app.seed_data import seed_database_if_empty
from backend.app.api import (
    incidents,
    triage,
    hardware,
    benchmark,
    reports,
    demo
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure database tables and initial realistic Indian flood seeds are created."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Flood-to-Flow AI",
    description="Offline Disaster Intelligence for Snapdragon-powered HP AI PCs",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite development & Windows desktop access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(incidents.router)
app.include_router(triage.router)
app.include_router(hardware.router)
app.include_router(benchmark.router)
app.include_router(reports.router)
app.include_router(demo.router)

# Mount demo media static directory
demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "demo"))
if os.path.exists(demo_dir):
    app.mount("/demo", StaticFiles(directory=demo_dir), name="demo")


@app.get("/")
def root():
    return {
        "project": "Flood-to-Flow AI",
        "tagline": "Offline Disaster Intelligence for Snapdragon-powered HP AI PCs",
        "status": "OPERATIONAL",
        "offline_ready": True,
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
