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

class SecurityAlert(Base):
    __tablename__ = "security_alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    message = Column(String(500))
    protocol = Column(String(20))
    src_ip = Column(String(50))
    dst_ip = Column(String(50))
    severity = Column(String(20)) # high, medium, low
    is_phishing = Column(Integer, default=0) # Using Integer (0/1) for compatibility

class NetworkScan(Base):
    __tablename__ = "network_scans"
    id = Column(Integer, primary_key=True, index=True)
    target = Column(String(255))
    hostname = Column(String(255))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    overall_risk = Column(String(20))
    ports = relationship("PortScan", back_populates="scan")

class PortScan(Base):
    __tablename__ = "port_scans"
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("network_scans.id"))
    port = Column(Integer)
    service = Column(String(50))
    state = Column(String(20)) # open, closed
    risk = Column(String(20)) # high, medium, low
    
    scan = relationship("NetworkScan", back_populates="ports")
