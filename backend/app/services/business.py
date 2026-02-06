from sqlalchemy.orm import Session
from ..models.financial import BusinessContext, IndustryType
from ..core.security import encrypt_data, decrypt_data

def create_business_context(db: Session, name: str, industry: str, gst_number: str = None):
    # Ensure industry is valid
    if industry not in [i.value for i in IndustryType]:
        raise ValueError(f"Invalid industry type: {industry}")
    
    # Encrypt sensitive data
    encrypted_gst = encrypt_data(gst_number) if gst_number else None
    
    db_business = BusinessContext(
        name=name,
        industry=industry,
        gst_number=encrypted_gst
    )
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

def get_business_context(db: Session, business_id: int):
    business = db.query(BusinessContext).filter(BusinessContext.id == business_id).first()
    if business and business.gst_number:
        # Decrypt for the application layer if needed
        # In a real app, we might keep it encrypted unless explicitly requested
        business.gst_number = decrypt_data(business.gst_number)
    return business

def list_businesses(db: Session):
    return db.query(BusinessContext).all()
