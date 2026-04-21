from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import db
from app.services.alert_service import alert_service

router = APIRouter()

@router.get("/alerts")
def get_alerts(limit: int = Query(50, ge=1), db_session: Session = Depends(db.get_db)):
    """Retrieve the most recent IDS alerts from the database."""
    return alert_service.get_alerts(db_session, limit=limit)

@router.post("/alerts/simulate")
def simulate_alert(db_session: Session = Depends(db.get_db)):
    """Manual trigger to generate a simulated security alert for demonstration."""
    return alert_service.generate_random_alert(db_session)
