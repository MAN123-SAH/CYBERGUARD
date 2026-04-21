from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import db, models
import csv
import io

router = APIRouter()

@router.get("/logs/export")
def export_logs(type: str = "all", format: str = "csv", db_session: Session = Depends(db.get_db)):
    """Exports system data as CSV or JSON"""
    si = io.StringIO()
    cw = csv.writer(si)
    
    if type == "alerts" or type == "all":
        alerts = db_session.query(models.SecurityAlert).all()
        cw.writerow(["--- SECURITY ALERTS ---"])
        cw.writerow(["Timestamp", "Message", "Protocol", "Source", "Destination", "Severity"])
        for a in alerts:
            cw.writerow([a.timestamp, a.message, a.protocol, a.src_ip, a.dst_ip, a.severity])
        cw.writerow([])
            
    if type == "phishing" or type == "all":
        phishing = db_session.query(models.PhishingInput).all()
        cw.writerow(["--- PHISHING DETECTIONS ---"])
        cw.writerow(["Timestamp", "URL", "Result Models"])
        for p in phishing:
            model_results = ", ".join([f"{r.model_name}:{r.prediction}" for r in p.results])
            cw.writerow([p.timestamp, p.url, model_results])
        cw.writerow([])
        
    if type == "network" or type == "all":
        scans = db_session.query(models.NetworkScan).all()
        cw.writerow(["--- NETWORK SCANS ---"])
        cw.writerow(["Timestamp", "Target", "Hostname", "Overall Risk", "Open Ports"])
        for s in scans:
            ports = ", ".join([f"{p.port}/{p.service}" for p in s.ports])
            cw.writerow([s.timestamp, s.target, s.hostname, s.overall_risk, ports])
            
    output = si.getvalue()
    
    return Response(
        content=output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cyberguard_security_export.csv"}
    )

@router.get("/logs/summary")
def get_logs_summary(db_session: Session = Depends(db.get_db)):
    """Get metadata for the Logs page"""
    phishing_count = db_session.query(models.PhishingInput).count()
    alert_count = db_session.query(models.SecurityAlert).count()
    network_count = db_session.query(models.NetworkScan).count()
    
    return [
        { "id": 1, "date": "Live Database", "type": "IDS Alert Summary", "entries": alert_count, "status": "Complete", "download_type": "alerts" },
        { "id": 2, "date": "Live Database", "type": "Phishing Analysis", "entries": phishing_count, "status": "Complete", "download_type": "phishing" },
        { "id": 3, "date": "Live Database", "type": "Network Scan", "entries": network_count, "status": "Complete", "download_type": "network" },
        { "id": 4, "date": "Live Database", "type": "System Audit (All)", "entries": alert_count + phishing_count + network_count, "status": "Complete", "download_type": "all" },
        { "id": 5, "date": "Today", "type": "Live Packet Capture Log", "entries": 1024, "status": "In Progress", "download_type": "none" },
    ]
