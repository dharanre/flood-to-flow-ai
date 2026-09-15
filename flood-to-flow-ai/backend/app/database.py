"""
SQLite Database Connection & Session Management for Flood-to-Flow AI.
Ensures local-first, offline persistence without cloud dependencies.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Store SQLite DB in data/ directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "flood_to_flow.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

# SQLite requires check_same_thread=False for multi-threaded FastAPI workers
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for providing request-scoped DB sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
