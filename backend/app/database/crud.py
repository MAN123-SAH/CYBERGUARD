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
