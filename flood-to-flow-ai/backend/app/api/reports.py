"""
PDF Incident Brief Report Generation API Router.
Compiles and streams responder-ready PDF incident briefs for field dispatch.
"""

import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.crud import get_incident, serialize_incident
from backend.app.utils.pdf_generator import generate_incident_brief_pdf

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/{incident_id}/pdf")
def download_incident_pdf(incident_id: str, db: Session = Depends(get_db)):
    """
    Generate and stream an emergency PDF Incident Brief.
    """
    incident = get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    serialized = serialize_incident(incident)

    reports_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports"))
    os.makedirs(reports_dir, exist_ok=True)
    pdf_filename = f"Incident_Brief_{incident_id}.pdf"
    output_pdf_path = os.path.join(reports_dir, pdf_filename)

    generate_incident_brief_pdf(serialized, output_pdf_path)

    return FileResponse(
        path=output_pdf_path,
        filename=pdf_filename,
        media_type="application/pdf"
    )
