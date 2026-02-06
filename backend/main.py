from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.database import SessionLocal, engine, Base
from app.models.financial import BusinessContext
from app.services.business import create_business_context

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SME Financial Health Platform",
    description="AI-powered financial assessment and optimization for SMEs",
    version="2.0.0"
)

# Origins for CORS - Explicitly allowing localhost and 127.0.0.1
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "*" # Development convenience
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "SME Financial Health Platform API v2.0 is Ready"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
