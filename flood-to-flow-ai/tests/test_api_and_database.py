"""
Integration Tests for FastAPI Endpoints, SQLite CRUD, and Triage Workflow.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import SessionLocal, Base, engine
from backend.app.seed_data import seed_database_if_empty

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database_if_empty(db)
    db.close()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "Flood-to-Flow AI"
    assert data["offline_ready"] is True


def test_hardware_status_api():
    response = client.get("/api/hardware/status")
    assert response.status_code == 200
    data = response.json()
    assert "active_provider" in data
    assert "device_name" in data
    assert "benchmark_status" in data


def test_get_incidents_list():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 5
    # Verify sorted by priority / score descending
    assert incidents[0]["priority_score"] >= incidents[-1]["priority_score"]


def test_incident_filters():
    # Filter HIGH priority
    response = client.get("/api/incidents?priority=HIGH")
    assert response.status_code == 200
    for inc in response.json():
        assert inc["priority"] == "HIGH"

    # Filter medical only
    response_med = client.get("/api/incidents?medical_only=true")
    assert response_med.status_code == 200
    for inc in response_med.json():
        assert inc["medical_emergency"] is True


def test_create_and_triage_new_incident():
    payload = {
        "title": "Severe Flash Flood near River Gate",
        "location_name": "Sector 4 Barrage Road, Prayagraj",
        "latitude": 25.4410,
        "longitude": 81.8520,
        "people_affected": 4,
        "vulnerable_present": True,
        "medical_emergency": True,
        "road_blocked": True,
        "water_entering_building": True,
        "sample_scenario_type": "severe_residential",
        "sample_voice_text": "Water entered ground floor rapidly. Four residents are trapped, one senior citizen is in critical need of oxygen assistance. Roadway is severed."
    }

    response = client.post("/api/incidents", json=payload)
    assert response.status_code == 200
    new_inc = response.json()
    assert new_inc["id"].startswith("INC-2026-")
    assert new_inc["priority"] == "HIGH"
    assert new_inc["priority_score"] == 100
    assert new_inc["visual_evidence"] is not None
    assert new_inc["voice_evidence"] is not None
    assert new_inc["triage_assessment"] is not None
    assert "Why this incident is HIGH priority" in new_inc["triage_assessment"]["headline_reason"]


def test_dashboard_stats_overview():
    response = client.get("/api/incidents/stats/overview")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_incidents"] >= 5
    assert stats["high_priority_count"] >= 1
    assert "hardware_status" in stats
