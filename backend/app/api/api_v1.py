from fastapi import APIRouter
from app.api.endpoints import auth, patients, campaigns

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
