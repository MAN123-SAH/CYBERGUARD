from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, history
from app.database.db import engine, Base
from app.config import settings

# Create database tables on startup
# Note: In production, you might want to use Alembic for migrations
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend for Phishing URL Detection System using Multiple ML Models",
    version="1.0.0"
)

# CORS Configuration
# Allow the React frontend (usually localhost:5173 for Vite) to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(history.router, prefix="/api", tags=["History"])

@app.get("/")
def root():
    return {"message": "Phishing URL Detection API is running!", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
