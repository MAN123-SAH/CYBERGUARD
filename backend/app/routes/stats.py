from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import db, models

router = APIRouter()

@router.get("/stats")
def get_stats(db_session: Session = Depends(db.get_db)):
    total_phishing = db_session.query(models.PhishingInput).count()
    total_alerts = db_session.query(models.SecurityAlert).count()
    total_scans = db_session.query(models.NetworkScan).count()
    
    return {
        "phishing_scans": total_phishing,
        "ids_alerts": total_alerts,
        "network_scans": total_scans
    }
