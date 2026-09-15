"""
SQLAlchemy ORM Models for Flood-to-Flow AI.
Encapsulates multimodal disaster incidents, AI evidence, triage calculations, and timestamps.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime
from backend.app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    location_name = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    priority = Column(String(20), default="MEDIUM", index=True)  # HIGH, MEDIUM, LOW
    priority_score = Column(Integer, default=50)                 # 0 - 100
    status = Column(String(50), default="TRIAGED", index=True)    # PENDING, TRIAGED, DISPATCHED, RESOLVED

    # Field Observations
    people_affected = Column(Integer, default=1)
    vulnerable_present = Column(Boolean, default=False)
    medical_emergency = Column(Boolean, default=False)
    road_blocked = Column(Boolean, default=False)
    water_entering_building = Column(Boolean, default=False)
    manual_notes = Column(Text, nullable=True)

    # Stored Multimodal Artifacts (JSON text)
    visual_evidence = Column(Text, nullable=True)
    voice_evidence = Column(Text, nullable=True)
    fused_evidence = Column(Text, nullable=True)
    triage_assessment = Column(Text, nullable=True)

    image_url = Column(String(500), nullable=True)
    voice_url = Column(String(500), nullable=True)

    # Hardware provenance
    execution_provider = Column(String(50), default="CPUExecutionProvider")
    is_demo = Column(Boolean, default=False)

    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
