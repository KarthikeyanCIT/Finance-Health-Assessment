from sqlalchemy.orm import Session
from ..models.financial import User, BusinessContext
from ..core.security import get_password_hash, verify_password
from .business import create_business_context

def create_user(db: Session, user_data: dict):
    hashed_pwd = get_password_hash(user_data["password"])
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data["email"]).first()
    if existing_user:
        return None
        
    db_user = User(
        email=user_data["email"],
        hashed_password=hashed_pwd,
        full_name=user_data.get("full_name", ""),
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Auto-create business context for new user
    biz = create_business_context(
        db, 
        name=f"{db_user.full_name}'s Enterprise", 
        industry="Services", 
        gst_number="27AAACN0000X1Z1" # Default placeholder
    )
    
    db_user.business_id = biz.id
    db.commit()
    db.refresh(db_user)
    
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
