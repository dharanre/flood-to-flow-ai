"""
Pydantic Schemas for Flood-to-Flow AI API requests, responses, and triage structures.
Modern Pydantic V2 compliant.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class IncidentBase(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Residential Flooding near Sector 12"})
    location_name: str = Field(..., json_schema_extra={"example": "Sector 12, Prayagraj, UP"})
    latitude: float = Field(..., json_schema_extra={"example": 25.4358})
    longitude: float = Field(..., json_schema_extra={"example": 81.8463})
    people_affected: int = Field(default=1, ge=1)
    vulnerable_present: bool = False
    medical_emergency: bool = False
    road_blocked: bool = False
    water_entering_building: bool = False
    manual_notes: Optional[str] = None


class IncidentCreate(IncidentBase):
    sample_scenario_type: Optional[str] = "residential"
    sample_voice_text: Optional[str] = None
    image_url: Optional[str] = None
    voice_url: Optional[str] = None
    is_demo: bool = False


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    manual_notes: Optional[str] = None
    people_affected: Optional[int] = None
    vulnerable_present: Optional[bool] = None
    medical_emergency: Optional[bool] = None
    road_blocked: Optional[bool] = None
    water_entering_building: Optional[bool] = None


class IncidentResponse(IncidentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    priority: str
    priority_score: int
    status: str
    image_url: Optional[str] = None
    voice_url: Optional[str] = None
    execution_provider: str
    is_demo: bool
    created_at: datetime
    updated_at: datetime
    visual_evidence: Optional[Dict[str, Any]] = None
    voice_evidence: Optional[Dict[str, Any]] = None
    fused_evidence: Optional[Dict[str, Any]] = None
    triage_assessment: Optional[Dict[str, Any]] = None


class HardwareStatusResponse(BaseModel):
    os: str
    architecture: str
    processor: str
    device_name: str
    is_snapdragon_detected: bool
    npu_available: bool
    npu_tops: Optional[str] = None
    active_provider: str
    available_providers: List[str]
    fallback_active: bool
    fallback_reason: Optional[str] = None
    benchmark_status: str
    recommended_target: str


class DashboardStatsResponse(BaseModel):
    total_incidents: int
    high_priority_count: int
    medium_priority_count: int
    low_priority_count: int
    active_triaged_count: int
    dispatched_count: int
    medical_emergencies_count: int
    road_blockages_count: int
    hardware_status: HardwareStatusResponse
