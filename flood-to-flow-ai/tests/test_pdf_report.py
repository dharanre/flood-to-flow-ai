"""
Tests for Responder-Ready Incident Brief PDF Generation.
"""

import os
import pytest
from backend.app.utils.pdf_generator import generate_incident_brief_pdf


def test_pdf_brief_creation(tmp_path):
    output_pdf = os.path.join(tmp_path, "test_brief.pdf")

    sample_incident = {
        "id": "INC-TEST-001",
        "title": "Ground-floor flooding near residential block",
        "location_name": "Sector 12, Prayagraj, UP",
        "latitude": 25.4358,
        "longitude": 81.8463,
        "priority": "HIGH",
        "priority_score": 100,
        "status": "TRIAGED",
        "triage_assessment": {
            "headline_reason": "Why this incident is HIGH priority",
            "detailed_reasoning": "Vulnerable resident + medical emergency + road blocked.",
            "points_breakdown": [
                {"factor": "Vulnerable resident present", "points": 30, "source": "Speech & Manual", "detail": "Elderly senior requiring evacuation."},
                {"factor": "Medical assistance requested", "points": 25, "source": "Speech", "detail": "Immediate medical attention needed."}
            ],
            "recommended_actions": [
                {"title": "Deploy Evacuation Boat Team", "description": "Dispatch inflatable boat team."}
            ]
        },
        "fused_evidence": {
            "ai_findings": ["Standing floodwater detected", "Blocked road identified"],
            "voice_findings": ["Elderly person mentioned", "Medical aid requested"],
            "human_findings": ["5 people affected", "Vulnerable persons: Yes"]
        },
        "voice_evidence": {
            "transcript": "Water has entered ground floor. Five people inside and elderly resident needs assistance."
        }
    }

    path = generate_incident_brief_pdf(sample_incident, output_pdf)
    assert os.path.exists(path)
    assert os.path.getsize(path) > 1000  # Non-trivial PDF generated
