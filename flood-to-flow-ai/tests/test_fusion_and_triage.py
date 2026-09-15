"""
Unit Tests for Evidence Fusion Engine & Explainable Triage Scoring.
"""

import pytest
from ml.fusion.fusion_engine import fusion_engine
from ml.fusion.triage_engine import triage_engine


def test_multimodal_evidence_fusion():
    visual_ev = {
        "detections": [
            {"label": "standing_water"},
            {"label": "submerged_vehicle"},
            {"label": "blocked_road"},
            {"label": "building_entrance_flooded"}
        ],
        "water_coverage_ratio": 0.55
    }
    voice_ev = {
        "transcript": "Water has entered ground floor. Five people inside and elderly resident needs help. Road is blocked.",
        "entities": {
            "vulnerable_person_detected": True,
            "vulnerable_terms": ["elderly resident"],
            "medical_emergency_detected": True,
            "medical_terms": ["needs help"],
            "building_impact_detected": True,
            "building_terms": ["ground floor"],
            "road_blockage_detected": True,
            "road_terms": ["road is blocked"],
            "people_count_extracted": 5
        }
    }
    manual_ev = {
        "people_affected": 5,
        "vulnerable_present": True,
        "medical_emergency": True,
        "road_blocked": True,
        "water_entering_building": True
    }

    fused = fusion_engine.fuse_evidence(visual_ev, voice_ev, manual_ev)

    assert fused["vulnerable_confirmed"] is True
    assert fused["medical_confirmed"] is True
    assert fused["building_impact_confirmed"] is True
    assert fused["road_blockage_confirmed"] is True
    assert fused["people_count"] == 5
    assert fused["overall_confidence"] >= 0.90
    assert len(fused["corroborations"]) >= 2


def test_triage_score_transparent_breakdown():
    fused = {
        "vulnerable_confirmed": True,
        "medical_confirmed": True,
        "building_impact_confirmed": True,
        "road_blockage_confirmed": True,
        "people_count": 5,
        "water_ratio": 0.55,
        "submerged_vehicle": True
    }

    result = triage_engine.calculate_priority(fused)

    assert result["priority"] == "HIGH"
    assert result["total_score"] == 100
    assert result["max_score"] == 100

    factors = [item["factor"] for item in result["points_breakdown"]]
    points_dict = {item["factor"]: item["points"] for item in result["points_breakdown"]}

    # Check that transparent points match specifications
    assert points_dict["Vulnerable resident present"] == 30
    assert points_dict["Medical assistance requested"] == 25
    assert points_dict["Building flooded / entrance breached"] == 20
    assert points_dict["Road blocked / route cut off"] == 15
    assert points_dict["Severe floodwater evidence"] == 10

    assert "Why this incident is HIGH priority" in result["headline_reason"]
    assert len(result["recommended_actions"]) >= 3
    assert "AI-assisted assessment" in result["safety_disclaimer"]


def test_low_priority_scenario():
    fused = {
        "vulnerable_confirmed": False,
        "medical_confirmed": False,
        "building_impact_confirmed": False,
        "road_blockage_confirmed": False,
        "people_count": 1,
        "water_ratio": 0.20,
        "submerged_vehicle": False
    }

    result = triage_engine.calculate_priority(fused)
    assert result["priority"] == "LOW"
    assert result["total_score"] < 40
