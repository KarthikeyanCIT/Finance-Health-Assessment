from fastapi import APIRouter
from app.api.endpoints import upload, analysis, business, comprehensive, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(upload.router, prefix="/data", tags=["data"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(business.router, prefix="/business", tags=["business"])
api_router.include_router(comprehensive.router, prefix="/comprehensive", tags=["comprehensive"])
