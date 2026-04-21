from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime

class BaseSchema(BaseModel):
    model_config = ConfigDict(protected_namespaces=(), from_attributes=True)

class ModelResultSchema(BaseSchema):
    prediction: str
    confidence: float

class PredictResponse(BaseSchema):
    url: str
    models: Dict[str, ModelResultSchema]
    final_prediction: str
    votes: Dict[str, int]

class URLInput(BaseSchema):
    url: str

class PhishingResultHistory(BaseSchema):
    model_name: str
    prediction: str
    confidence: float

class PhishingInputHistory(BaseSchema):
    id: int
    url: str
    timestamp: datetime
    results: List[PhishingResultHistory]
