"""
Database CRUD Operations for Incidents & Evidence Records.
"""

import json
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models import Incident
from backend.app.schemas import IncidentCreate, IncidentUpdate


def get_incident(db: Session, incident_id: str) -> Optional[Incident]:
    return db.query(Incident).filter(Incident.id == incident_id).first()


def get_incidents(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    medical_only: bool = False,
    road_blocked_only: bool = False,
    building_flooded_only: bool = False
) -> List[Incident]:
    query = db.query(Incident)

    if priority:
        query = query.filter(Incident.priority == priority.upper())
    if status:
        query = query.filter(Incident.status == status.upper())
    if medical_only:
        query = query.filter(Incident.medical_emergency == True)
    if road_blocked_only:
        query = query.filter(Incident.road_blocked == True)
    if building_flooded_only:
        query = query.filter(Incident.water_entering_building == True)

    return query.order_by(Incident.priority_score.desc(), Incident.created_at.desc()).offset(skip).limit(limit).all()


def create_incident_record(db: Session, incident_data: IncidentCreate, incident_id: str, triage_results: dict) -> Incident:
    vis_json = json.dumps(triage_results.get("visual_evidence", {}))
    voice_json = json.dumps(triage_results.get("voice_evidence", {}))
    fused_json = json.dumps(triage_results.get("fused_evidence", {}))
    triage_json = json.dumps(triage_results.get("triage_assessment", {}))

    db_incident = Incident(
        id=incident_id,
        title=incident_data.title,
        location_name=incident_data.location_name,
        latitude=incident_data.latitude,
        longitude=incident_data.longitude,
        people_affected=triage_results.get("fused_evidence", {}).get("people_count", incident_data.people_affected),
        vulnerable_present=triage_results.get("fused_evidence", {}).get("vulnerable_confirmed", incident_data.vulnerable_present),
        medical_emergency=triage_results.get("fused_evidence", {}).get("medical_confirmed", incident_data.medical_emergency),
        road_blocked=triage_results.get("fused_evidence", {}).get("road_blockage_confirmed", incident_data.road_blocked),
        water_entering_building=triage_results.get("fused_evidence", {}).get("building_impact_confirmed", incident_data.water_entering_building),
        manual_notes=incident_data.manual_notes,
        priority=triage_results.get("triage_assessment", {}).get("priority", "MEDIUM"),
        priority_score=triage_results.get("triage_assessment", {}).get("total_score", 50),
        status="TRIAGED",
        visual_evidence=vis_json,
        voice_evidence=voice_json,
        fused_evidence=fused_json,
        triage_assessment=triage_json,
        image_url=incident_data.image_url,
        voice_url=incident_data.voice_url,
        execution_provider=triage_results.get("visual_evidence", {}).get("provider", "CPUExecutionProvider"),
        is_demo=incident_data.is_demo
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident


def update_incident_record(db: Session, incident_id: str, updates: IncidentUpdate) -> Optional[Incident]:
    db_incident = get_incident(db, incident_id)
    if not db_incident:
        return None

    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_incident, key, value)

    db.commit()
    db.refresh(db_incident)
    return db_incident


def delete_incident_record(db: Session, incident_id: str) -> bool:
    db_incident = get_incident(db, incident_id)
    if not db_incident:
        return False
    db.delete(db_incident)
    db.commit()
    return True


def serialize_incident(incident: Incident) -> dict:
    """Helper to deserialize JSON strings for API response."""
    return {
        "id": incident.id,
        "title": incident.title,
        "location_name": incident.location_name,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "people_affected": incident.people_affected,
        "vulnerable_present": incident.vulnerable_present,
        "medical_emergency": incident.medical_emergency,
        "road_blocked": incident.road_blocked,
        "water_entering_building": incident.water_entering_building,
        "manual_notes": incident.manual_notes,
        "priority": incident.priority,
        "priority_score": incident.priority_score,
        "status": incident.status,
        "image_url": incident.image_url,
        "voice_url": incident.voice_url,
        "execution_provider": incident.execution_provider,
        "is_demo": incident.is_demo,
        "created_at": incident.created_at,
        "updated_at": incident.updated_at,
        "visual_evidence": json.loads(incident.visual_evidence) if incident.visual_evidence else None,
        "voice_evidence": json.loads(incident.voice_evidence) if incident.voice_evidence else None,
        "fused_evidence": json.loads(incident.fused_evidence) if incident.fused_evidence else None,
        "triage_assessment": json.loads(incident.triage_assessment) if incident.triage_assessment else None
    }
