from sqlalchemy.orm import Session
from . import models
from app.schemas import schemas

def create_phishing_result(db: Session, prediction_data: dict):
    # 1. Create PhishingInput
    db_input = models.PhishingInput(url=prediction_data["url"])
    db.add(db_input)
    db.commit()
    db.refresh(db_input)
    
    # 2. Create PhishingResults for each model
    for model_name, result in prediction_data["models"].items():
        db_result = models.PhishingResult(
            input_id=db_input.id,
            model_name=model_name,
            prediction=result["prediction"],
            confidence=result["confidence"]
        )
        db.add(db_result)
    
    db.commit()
    return db_input

def get_history(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.PhishingInput).order_by(models.PhishingInput.timestamp.desc()).offset(skip).limit(limit).all()

def create_network_scan(db: Session, scan_data: dict):
    db_scan = models.NetworkScan(
        target=scan_data["target"],
        hostname=scan_data["hostname"],
        overall_risk=scan_data["overall_risk"]
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    for p in scan_data["ports"]:
        db_port = models.PortScan(
            scan_id=db_scan.id,
            port=p["port"],
            service=p["service"],
            state="open",
            risk=p["risk"]
        )
        db.add(db_port)
    
    db.commit()
    return db_scan

def get_recent_scans(db: Session, limit: int = 10):
    return db.query(models.NetworkScan).order_by(models.NetworkScan.timestamp.desc()).limit(limit).all()
