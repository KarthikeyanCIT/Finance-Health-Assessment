from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ...core.database import get_db
from ...services import user_service

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    user = user_service.create_user(db, user_in.model_dump())
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    return {
        "message": "User created successfully",
        "user_id": user.id,
        "business_id": user.business_id
    }

@router.post("/login")
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = user_service.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return {
        "message": "Login successful",
        "user_id": user.id,
        "business_id": user.business_id,
        "full_name": user.full_name
    }
