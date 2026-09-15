"""
Triage & Explainability API Endpoint.
Exposes transparent priority scoring and multimodal fusion calculations.
"""

from fastapi import APIRouter
from typing import Dict, Any
from pydantic import BaseModel
from ml.fusion.fusion_engine import fusion_engine
from ml.fusion.triage_engine import triage_engine

router = APIRouter(prefix="/api/triage", tags=["Triage & Explainability"])


class TriageCalculationRequest(BaseModel):
    visual_evidence: Dict[str, Any]
    voice_evidence: Dict[str, Any]
    manual_evidence: Dict[str, Any]


@router.post("/calculate")
def calculate_triage_score(payload: TriageCalculationRequest):
    """
    Perform multimodal fusion and calculate transparent triage score
    with itemized points breakdown and recommended actions.
    """
    fused = fusion_engine.fuse_evidence(
        payload.visual_evidence,
        payload.voice_evidence,
        payload.manual_evidence
    )
    assessment = triage_engine.calculate_priority(fused)

    return {
        "fused_evidence": fused,
        "triage_assessment": assessment
    }
