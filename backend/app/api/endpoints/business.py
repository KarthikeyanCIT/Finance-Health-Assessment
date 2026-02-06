from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services import business
from pydantic import BaseModel

router = APIRouter()

class BusinessCreate(BaseModel):
    name: str
    industry: str
    gst_number: str = None

@router.post("/")
def create_business(data: BusinessCreate, db: Session = Depends(get_db)):
    try:
        return business.create_business_context(
            db, name=data.name, industry=data.industry, gst_number=data.gst_number
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
def list_businesses(db: Session = Depends(get_db)):
    return business.list_businesses(db)

@router.get("/{business_id}")
def get_business(business_id: int, db: Session = Depends(get_db)):
    biz = business.get_business_context(db, business_id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz
