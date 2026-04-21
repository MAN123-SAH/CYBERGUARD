from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import db, crud
from app.services.scanner_service import scanner_service
from pydantic import BaseModel

router = APIRouter()

class ScanRequest(BaseModel):
    target: str

@router.post("/scan")
def run_scan(request: ScanRequest, db_session: Session = Depends(db.get_db)):
    """Triggers a simulated network scan on a target and stores results."""
    try:
        # Perform simulation
        result = scanner_service.scan_target(request.target)
        # Persist to DB
        crud.create_network_scan(db_session, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scans/recent")
def get_recent_scans(limit: int = 10, db_session: Session = Depends(db.get_db)):
    """Retrieve the most recent network scan results."""
    return crud.get_recent_scans(db_session, limit=limit)
