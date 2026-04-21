import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, history, alerts, scanner, stats, password, packets, logs
from app.database.db import engine, Base, SessionLocal
from app.config import settings

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend for Phishing URL Detection System using Multiple ML Models",
    version="1.0.0"
)

async def simulate_ids_alerts():
    from app.services.alert_service import alert_service
    while True:
        await asyncio.sleep(15)  # Every 15 seconds generate an alert
        db = SessionLocal()
        try:
            alert_service.generate_random_alert(db)
        finally:
            db.close()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_ids_alerts())

# CORS Configuration
# Allow the React frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])
app.include_router(scanner.router, prefix="/api", tags=["Scanner"])
app.include_router(stats.router, prefix="/api", tags=["Stats"])
app.include_router(password.router, prefix="/api", tags=["Password"])
app.include_router(logs.router, prefix="/api", tags=["Logs"])
app.include_router(packets.router, prefix="", tags=["Packets"])

@app.get("/")
def root():
    return {"message": "Phishing URL Detection API is running!", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
