from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.services.prediction_service import prediction_service
from app.database import crud, db

router = APIRouter()

@router.post("/predict-url", response_model=schemas.PredictResponse)
def predict_url(input_data: schemas.URLInput, db_session: Session = Depends(db.get_db)):
    print(f"DEBUG: Processing URL: {input_data.url}")
    
    # --- URL VALIDATION GUARDRAIL ---
    import re
    # Basic URL regex that requires a .something at the end (TLD)
    url_pattern = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' # domain...
        r'localhost|' # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    # Allow some common formats without http prefix as well
    if not url_pattern.match(input_data.url) and not re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[/\S]*$', input_data.url):
        raise HTTPException(
            status_code=400, 
            detail="Invalid URL format. Please enter a valid website address (e.g., example.com)."
        )
    # --------------------------------
    
    try:
        # 1. Run inference
        result = prediction_service.predict(input_data.url)
        
        # 2. Save to database
        crud.create_phishing_result(db_session, result)
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
