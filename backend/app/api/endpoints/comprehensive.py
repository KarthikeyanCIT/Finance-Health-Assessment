from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services import analytics, advisor, business
from ...models.financial import Transaction

router = APIRouter()

@router.get("/{business_id}")
async def get_comprehensive_analysis(business_id: int, db: Session = Depends(get_db)):
    biz = business.get_business_context(db, business_id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Fetch real transactions for this business
    db_txns = db.query(Transaction).filter(Transaction.business_id == business_id).all()
    
    # Convert DB models to dict for analytics processing
    txns = []
    for t in db_txns:
        txns.append({
            "amount": t.amount,
            "transaction_type": t.transaction_type,
            "date": t.date,
            "category": t.category,
            "description": t.description
        })
    
    # If no transactions, use an empty list (analytics handles empty df)
    analysis = analytics.calculate_industry_ratios(txns, biz.industry)
    narrative_en = advisor.generate_financial_narrative(analysis, biz.industry, "en")
    narrative_hi = advisor.generate_financial_narrative(analysis, biz.industry, "hi")
    recommendations = advisor.recommend_financial_products(analysis, biz.industry)
    
    # Generate charts data (Dynamic)
    timeseries = analytics.get_timeseries_data(txns)
    
    return {
        "business": biz.name,
        "industry": biz.industry,
        "analysis": analysis,
        "narratives": {
            "en": narrative_en,
            "hi": narrative_hi
        },
        "recommendations": recommendations,
        "credit_score": analysis["overall_score"],
        "timeseries": timeseries,
        "has_data": len(txns) > 0
    }
