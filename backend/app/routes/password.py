from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.password_service import password_service

router = APIRouter()

class PasswordCheckRequest(BaseModel):
    password: str

@router.post("/password/check")
def check_password(request: PasswordCheckRequest):
    """Checks if a password has been compromised using Have I Been Pwned API"""
    try:
        breach_count = password_service.check_pwned_api(request.password)
        return {
            "breach_count": breach_count,
            "is_compromised": breach_count > 0,
            "message": "Password exposed in data breaches!" if breach_count > 0 else "Password not found in any known database breaches."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to check password.")
