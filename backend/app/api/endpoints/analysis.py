from fastapi import APIRouter
from ...services.ai_score import get_health_score, generate_cfo_response
from pydantic import BaseModel
import random
from datetime import datetime, timedelta

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

router = APIRouter()

@router.get("/health-score")
async def health_score(language: str = "en"):
    # Integrated AI Health Score
    return await get_health_score({})

@router.post("/chat")
async def chat_cfo(request: ChatRequest):
    response = await generate_cfo_response(request.message, request.context)
    return {"response": response}

@router.get("/cashflow-patterns")
async def cashflow():
    # 1.5 Cash Flow Pattern Intelligence
    return {
        "burn_rate": 45000,
        "cash_crunch_risk": "Low",
        "avg_monthly_burn_rate": 42500,
        "insights": [
            "Seasonal revenue spike detected in Q3 (+12%)",
            "Vendor payments (Rent) are stable",
            "Client payment delay averaging 5 days"
        ],
        "expense_breakdown": [
            {"name": "Payroll", "value": 150000},
            {"name": "Rent", "value": 25000},
            {"name": "Software", "value": 12000},
            {"name": "Marketing", "value": 8000},
            {"name": "Logistics", "value": 15000}
        ]
    }

@router.get("/compliance")
async def compliance():
    # 1.4 Tax Compliance & GST Risk Analyzer
    return {
        "risk_level": "Low",
        "gst_status": "Filed",
        "last_filing_date": "2023-09-20",
        "flags": [], # No mismatches
        "details": "All ITC claims match vendor filings. No notices detected."
    }

@router.get("/credit-eligibility")
async def credit_eligibility():
    # 1.2 Intelligent Creditworthiness & Loan Eligibility Engine
    return {
        "eligible": True,
        "max_loan_amount": 1500000,
        "recommended_products": [
            {"type": "Invoice Discounting", "match_score": 95, "reason": "Consistent receivables pattern matches discounting criteria."},
            {"type": "Working Capital Term Loan", "match_score": 82, "reason": "Healthy debt-service coverage ratio (1.8)."}
        ]
    }

@router.get("/forecast")
async def forecast():
    # 1.7 Financial Forecasting (AI-Assisted)
    # Generate 6 months of future data
    today = datetime.now()
    forecast_data = []
    base_revenue = 500000
    for i in range(6):
        month = (today + timedelta(days=30*i)).strftime("%b")
        # Add some trend/randomness
        growth_factor = 1 + (i * 0.05) + (random.uniform(-0.02, 0.05))
        forecast_data.append({
            "month": month,
            "projected_revenue": int(base_revenue * growth_factor),
            "projected_expense": int(base_revenue * growth_factor * 0.7)
        })
    return {"forecast": forecast_data}

@router.get("/report/export")
async def export_report():
    # 1.9 Investor-Ready Financial Reports (Mock PDF)
    # In a real app, we would stream a generated PDF here
    return {"message": "Report generation simulated. Download initiated."}
