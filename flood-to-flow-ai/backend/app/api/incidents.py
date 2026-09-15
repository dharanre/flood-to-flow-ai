"""
Incidents API Router: Handles incident creation, AI multimodal processing,
filtering, updates, and dashboard metrics.
"""

import time
import uuid
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Incident
from backend.app.schemas import (
    IncidentCreate,
    IncidentUpdate,
    IncidentResponse,
    DashboardStatsResponse,
    HardwareStatusResponse
)
from backend.app.crud import (
    get_incident,
    get_incidents,
    create_incident_record,
    update_incident_record,
    delete_incident_record,
    serialize_incident
)
from ml.runners.vision_runner import vision_runner
from ml.runners.speech_runner import speech_runner
from ml.fusion.fusion_engine import fusion_engine
from ml.fusion.triage_engine import triage_engine
from ml.hardware_detector import hardware_detector

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


@router.get("", response_model=List[IncidentResponse])
def list_incidents(
    priority: Optional[str] = Query(None, description="Filter by priority: HIGH, MEDIUM, LOW"),
    status: Optional[str] = Query(None, description="Filter by status: TRIAGED, DISPATCHED, RESOLVED"),
    medical_only: bool = Query(False, description="Only incidents with medical emergencies"),
    road_blocked_only: bool = Query(False, description="Only incidents with road blockages"),
    building_flooded_only: bool = Query(False, description="Only incidents with flooded buildings"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List disaster incidents with optional multi-factor triage filters."""
    incidents = get_incidents(
        db,
        skip=skip,
        limit=limit,
        priority=priority,
        status=status,
        medical_only=medical_only,
        road_blocked_only=road_blocked_only,
        building_flooded_only=building_flooded_only
    )
    return [serialize_incident(inc) for inc in incidents]


@router.get("/stats/overview", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Summary metrics for the command center overview cards."""
    all_incidents = db.query(Incident).all()
    total = len(all_incidents)
    high_count = sum(1 for i in all_incidents if i.priority == "HIGH")
    med_count = sum(1 for i in all_incidents if i.priority == "MEDIUM")
    low_count = sum(1 for i in all_incidents if i.priority == "LOW")
    active_count = sum(1 for i in all_incidents if i.status in ["PENDING", "TRIAGED"])
    dispatched_count = sum(1 for i in all_incidents if i.status == "DISPATCHED")
    medical_count = sum(1 for i in all_incidents if i.medical_emergency)
    road_count = sum(1 for i in all_incidents if i.road_blocked)

    hw = hardware_detector.get_hardware_info()
    hw_res = HardwareStatusResponse(
        os=f"{hw.get('os')} {hw.get('os_release', '')}".strip(),
        architecture=hw.get("architecture", "Unknown"),
        processor=hw.get("processor", "Unknown"),
        device_name=hw.get("device_name", "System CPU"),
        is_snapdragon_detected=hw.get("is_snapdragon_detected", False),
        npu_available=hw.get("npu_available", False),
        npu_tops=hw.get("npu_tops"),
        active_provider=hw.get("active_provider", "CPUExecutionProvider"),
        available_providers=hw.get("available_providers", []),
        fallback_active=hw.get("fallback_active", True),
        fallback_reason=hw.get("fallback_reason"),
        benchmark_status=hw.get("benchmark_status", "Not benchmarked"),
        recommended_target=hw.get("recommended_target", "Snapdragon X Elite / Plus")
    )

    return DashboardStatsResponse(
        total_incidents=total,
        high_priority_count=high_count,
        medium_priority_count=med_count,
        low_priority_count=low_count,
        active_triaged_count=active_count,
        dispatched_count=dispatched_count,
        medical_emergencies_count=medical_count,
        road_blockages_count=road_count,
        hardware_status=hw_res
    )


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_single_incident(incident_id: str, db: Session = Depends(get_db)):
    """Retrieve full incident details including multimodal AI findings and explainable score."""
    incident = get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return serialize_incident(incident)


@router.post("", response_model=IncidentResponse)
def create_incident(incident_in: IncidentCreate, db: Session = Depends(get_db)):
    """
    Create a new disaster incident.
    Executes VisionRunner (YOLO & PidNet) and SpeechRunner (Whisper) locally,
    performs Multimodal Fusion, and calculates Explainable Triage score.
    """
    # Generate unique Incident ID
    random_suffix = uuid.uuid4().hex[:4].upper()
    incident_id = f"INC-2026-{random_suffix}"

    # 1. Vision Processing
    vision_hints = []
    if incident_in.road_blocked:
        vision_hints.append("road")
    if incident_in.water_entering_building:
        vision_hints.append("building")
    if incident_in.sample_scenario_type == "vehicle":
        vision_hints.append("vehicle")

    vision_res = vision_runner.detect_objects(None, scenario_hints=vision_hints)
    seg_res = vision_runner.segment_scene(None, scenario_type=incident_in.sample_scenario_type or "residential")
    
    # Merge vision detections & segmentation
    visual_evidence = {
        "model": vision_res["model"],
        "provider": vision_res["provider"],
        "device": vision_res["device"],
        "detections": vision_res["detections"],
        "water_coverage_percentage": seg_res["water_coverage_percentage"],
        "water_coverage_ratio": seg_res["water_coverage_ratio"],
        "road_submerged": seg_res["road_submerged"],
        "building_entrance_flooded": seg_res["building_entrance_flooded"],
        "estimated_depth_cm": seg_res["estimated_depth_cm"],
        "hazard_category": seg_res["hazard_category"],
        "latency_ms": round(vision_res["total_time_ms"] + seg_res["total_time_ms"], 2)
    }

    # 2. Speech Processing
    voice_res = speech_runner.transcribe_audio(
        None,
        sample_transcript=incident_in.sample_voice_text
    )
    voice_evidence = {
        "model": voice_res["model"],
        "provider": voice_res["provider"],
        "device": voice_res["device"],
        "transcript": voice_res["transcript"],
        "confidence": voice_res["confidence"],
        "entities": voice_res["entities"],
        "latency_ms": voice_res["total_time_ms"]
    }

    # 3. Manual Evidence
    manual_evidence = {
        "people_affected": incident_in.people_affected,
        "vulnerable_present": incident_in.vulnerable_present,
        "medical_emergency": incident_in.medical_emergency,
        "road_blocked": incident_in.road_blocked,
        "water_entering_building": incident_in.water_entering_building,
        "manual_notes": incident_in.manual_notes
    }

    # 4. Multimodal Fusion
    fused_evidence = fusion_engine.fuse_evidence(
        visual_evidence,
        voice_evidence,
        manual_evidence
    )

    # 5. Explainable Triage Calculation
    triage_assessment = triage_engine.calculate_priority(fused_evidence)

    triage_results = {
        "visual_evidence": visual_evidence,
        "voice_evidence": voice_evidence,
        "fused_evidence": fused_evidence,
        "triage_assessment": triage_assessment
    }

    db_incident = create_incident_record(db, incident_in, incident_id, triage_results)
    return serialize_incident(db_incident)


@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: str, updates: IncidentUpdate, db: Session = Depends(get_db)):
    """Update status or field data of an existing incident."""
    updated = update_incident_record(db, incident_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return serialize_incident(updated)


@router.delete("/{incident_id}")
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    """Delete an incident record."""
    success = delete_incident_record(db, incident_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return {"message": f"Incident {incident_id} deleted successfully"}
