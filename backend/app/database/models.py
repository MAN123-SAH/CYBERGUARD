from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)

class PhishingInput(Base):
    __tablename__ = "phishing_inputs"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2083)) # Max URL length, removed index due to MySQL length limits
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    results = relationship("PhishingResult", back_populates="input")

class PhishingResult(Base):
    __tablename__ = "phishing_results"
    id = Column(Integer, primary_key=True, index=True)
    input_id = Column(Integer, ForeignKey("phishing_inputs.id"))
    model_name = Column(String(50))
    prediction = Column(String(50))
    confidence = Column(Float)
    
    input = relationship("PhishingInput", back_populates="results")
