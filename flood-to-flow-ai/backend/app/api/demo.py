"""
1-Click Demo API Router for Flood-to-Flow AI.
Provides instant reset and activation of the flagship 90-second Indian flood demonstration scenario.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Incident
from backend.app.crud import serialize_incident
from backend.app.seed_data import seed_database_if_empty

router = APIRouter(prefix="/api/demo", tags=["Demo Mode"])


@router.post("/reset-flagship")
def reset_flagship_demo(db: Session = Depends(get_db)):
    """
    Ensure the flagship Prayagraj Residential Flooding demo scenario
    is ready with full multimodal findings, explainable score, and sample media.
    """
    flagship = db.query(Incident).filter(Incident.id == "INC-2026-8801").first()
    if not flagship:
        seed_database_if_empty(db)
        flagship = db.query(Incident).filter(Incident.id == "INC-2026-8801").first()

    # Reset its status to TRIAGED so judges can step through triage
    flagship.status = "TRIAGED"
    db.commit()
    db.refresh(flagship)

    return {
        "message": "Flagship 90-second demo incident initialized successfully.",
        "incident": serialize_incident(flagship),
        "demo_guide": {
            "title": "Residential flooding near Sector 12, Prayagraj",
            "narrative": "A sudden drainage culvert burst flooded ground floor residential dwellings. 5 people trapped, including a bedridden senior.",
            "expected_priority": "HIGH (100/100 points)",
            "key_differentiator": "Explainable point breakdown (+30 vulnerable, +25 medical, +20 building, +15 road, +10 water) and zero cloud dependence on Snapdragon NPU."
        }
    }
