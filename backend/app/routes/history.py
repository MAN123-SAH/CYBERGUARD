from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import schemas
from app.database import crud, db
from typing import List

router = APIRouter()

@router.get("/history", response_model=List[schemas.PhishingInputHistory])
def read_history(skip: int = 0, limit: int = 50, db_session: Session = Depends(db.get_db)):
    history = crud.get_history(db_session, skip=skip, limit=limit)
    return history
