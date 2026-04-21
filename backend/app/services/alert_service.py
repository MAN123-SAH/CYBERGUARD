import random
from sqlalchemy.orm import Session
from app.database import models

class AlertService:
    def __init__(self):
        self.signatures = [
            {"message": "ET POLICY Phishing attempt detected", "protocol": "TCP", "severity": "high", "is_phishing": 1},
            {"message": "ET SCAN Potential SSH Brute Force", "protocol": "TCP", "severity": "high", "is_phishing": 0},
            {"message": "ET POLICY DNS Query to suspicious domain", "protocol": "UDP", "severity": "medium", "is_phishing": 1},
            {"message": "ET EXPLOIT Apache Struts RCE", "protocol": "TCP", "severity": "high", "is_phishing": 0},
            {"message": "ET MALWARE Win32.Trojan callback", "protocol": "TCP", "severity": "high", "is_phishing": 0},
            {"message": "ET INFO ICMP Ping sweep detected", "protocol": "ICMP", "severity": "low", "is_phishing": 0},
            {"message": "ET PHISHING Credential harvesting page", "protocol": "TCP", "severity": "high", "is_phishing": 1},
            {"message": "ET SCAN Nmap scripting engine scan", "protocol": "TCP", "severity": "medium", "is_phishing": 0},
        ]

    def generate_random_alert(self, db: Session):
        sig = random.choice(self.signatures)
        new_alert = models.SecurityAlert(
            message=sig["message"],
            protocol=sig["protocol"],
            src_ip=f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 255)}",
            dst_ip="10.0.0.1",
            severity=sig["severity"],
            is_phishing=sig["is_phishing"]
        )
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return new_alert

    def get_alerts(self, db: Session, limit: int = 50):
        return db.query(models.SecurityAlert).order_by(models.SecurityAlert.timestamp.desc()).limit(limit).all()

alert_service = AlertService()
