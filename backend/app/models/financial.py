from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Boolean
from ..core.database import Base
import enum
from datetime import datetime

class TransactionType(str, enum.Enum):
    INCOME = "Income"
    EXPENSE = "Expense"

class IndustryType(str, enum.Enum):
    MANUFACTURING = "Manufacturing"
    RETAIL = "Retail"
    AGRICULTURE = "Agriculture"
    SERVICES = "Services"
    LOGISTICS = "Logistics"
    ECOMMERCE = "E-commerce"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    business_id = Column(Integer, nullable=True) # Linked after business creation
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class BusinessContext(Base):
    __tablename__ = "business_context"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry = Column(String)  # IndustryType
    gst_number = Column(String, nullable=True)  # Should be encrypted
    created_at = Column(DateTime, default=datetime.utcnow)

class HealthSnapshot(Base):
    __tablename__ = "health_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer)
    overall_score = Column(Float)
    liquidity_ratio = Column(Float)
    burn_rate = Column(Float)
    
    # Store AI Narrative as text (can be long)
    narrative_en = Column(String)
    narrative_hi = Column(String, nullable=True) # Hindi support
    
    recommendations = Column(String) # JSON string or text
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, index=True, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    description = Column(String, index=True)
    amount = Column(Float)
    transaction_type = Column(String)
    category = Column(String, index=True)
    
    # Metadata for audit trail
    source_file = Column(String, nullable=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)
