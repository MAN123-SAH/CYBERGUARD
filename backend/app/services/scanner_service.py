import random
import time

class ScannerService:
    def scan_target(self, target: str):
        # Realistic simulation delay
        time.sleep(1.2)
        
        # Common ports data for simulation
        common_ports = [
            {"port": 21, "service": "FTP", "risk": "high"},
            {"port": 22, "service": "SSH", "risk": "medium"},
            {"port": 80, "service": "HTTP", "risk": "low"},
            {"port": 443, "service": "HTTPS", "risk": "low"},
            {"port": 3306, "service": "MySQL", "risk": "high"},
            {"port": 5432, "service": "PostgreSQL", "risk": "high"},
            {"port": 6379, "service": "Redis", "risk": "high"},
            {"port": 8080, "service": "HTTP-Proxy", "risk": "medium"},
        ]
        
        # Pick 3-6 random ports
        num_ports = random.randint(3, 6)
        found_ports = random.sample(common_ports, num_ports)
        
        # Sort by port number
        found_ports.sort(key=lambda x: x["port"])
        
        # Calculate overall risk
        has_high = any(p["risk"] == "high" for p in found_ports)
        overall_risk = "High" if has_high else "Medium"
        
        return {
            "target": target,
            "hostname": f"{target}.internal" if target.replace(".", "").isdigit() else target,
            "overall_risk": overall_risk,
            "ports": found_ports
        }

scanner_service = ScannerService()
