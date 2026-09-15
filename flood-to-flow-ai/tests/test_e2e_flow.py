"""
End-to-End Test for the 90-Second Flagship Demo Flow.
Simulates:
1. Hardware Acceleration Inspection (NPU/CPU fallback check)
2. Incident Creation with Multi-modal Evidence (Image, Audio, Field form)
3. Local AI Inference (YOLO, PidNet, Whisper)
4. Evidence Fusion & Cross-Modality Consensus
5. Transparent Triage (100 pts High Priority calculation & reasoning)
6. Tactical Action Generation
7. PDF Incident Brief Export
"""

import os
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_flagship_90sec_demo_scenario_e2e():
    # STEP 1: Hardware Acceleration & NPU Check
    hw_res = client.get("/api/hardware/status")
    assert hw_res.status_code == 200
    hw = hw_res.json()
    assert "active_provider" in hw
    assert "CPUExecutionProvider" in hw["available_providers"] or hw["active_provider"] == "QNNExecutionProvider"

    # STEP 2: Trigger Flagship Demo Reset
    demo_res = client.post("/api/demo/reset-flagship")
    assert demo_res.status_code == 200
    demo_data = demo_res.json()
    incident = demo_data["incident"]

    assert incident["id"] == "INC-2026-8801"
    assert incident["title"] == "Ground-floor flooding near residential block"
    assert incident["location_name"] == "Sector 12, Prayagraj, Uttar Pradesh"

    # STEP 3: Verify Multimodal Evidence Extraction
    vis = incident["visual_evidence"]
    assert vis is not None
    assert vis["water_coverage_percentage"] >= 50.0
    labels = [d["label"] for d in vis["detections"]]
    assert "standing_water" in labels
    assert "submerged_vehicle" in labels
    assert "blocked_road" in labels
    assert "building_entrance_flooded" in labels

    # Speech extraction
    voice = incident["voice_evidence"]
    assert voice is not None
    assert "elderly resident" in voice["transcript"]
    assert voice["entities"]["vulnerable_person_detected"] is True
    assert voice["entities"]["medical_emergency_detected"] is True
    assert voice["entities"]["road_blockage_detected"] is True

    # STEP 4: Verify Fusion Engine Results
    fused = incident["fused_evidence"]
    assert fused["vulnerable_confirmed"] is True
    assert fused["medical_confirmed"] is True
    assert fused["road_blockage_confirmed"] is True
    assert fused["building_impact_confirmed"] is True
    assert fused["people_count"] == 5
    assert fused["overall_confidence"] >= 0.90

    # STEP 5: Verify Transparent Triage & Explainable Points
    triage = incident["triage_assessment"]
    assert triage["priority"] == "HIGH"
    assert triage["total_score"] == 100
    assert "Why this incident is HIGH priority" in triage["headline_reason"]

    # Verify transparent point additions
    points_dict = {item["factor"]: item["points"] for item in triage["points_breakdown"]}
    assert points_dict["Vulnerable resident present"] == 30
    assert points_dict["Medical assistance requested"] == 25
    assert points_dict["Building flooded / entrance breached"] == 20
    assert points_dict["Road blocked / route cut off"] == 15
    assert points_dict["Severe floodwater evidence"] == 10

    # STEP 6: Verify Actionable Tactical Directives
    actions = triage["recommended_actions"]
    assert len(actions) >= 3
    action_types = [a["type"] for a in actions]
    assert "evacuation" in action_types
    assert "medical" in action_types

    # STEP 7: Verify PDF Brief Generation & Download
    pdf_res = client.get(f"/api/reports/{incident['id']}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000  # valid binary PDF payload
