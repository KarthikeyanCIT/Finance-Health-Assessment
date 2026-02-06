from typing import Dict, List
from ..models.financial import IndustryType

def generate_financial_narrative(metrics: Dict, industry: str, language: str = "en") -> str:
    """
    Generates a professional financial narrative. 
    In production, this would call GPT-5/Claude with a prompt.
    """
    score = metrics.get("overall_score", 0)
    status = metrics.get("metrics", {}).get("status", "Unknown")
    
    if language == "hi":
        # Placeholder for Hindi translation layer
        return f"आपके व्यवसाय का वित्तीय स्वास्थ्य {score}/100 है। आपकी स्थिति: {status}।"

    templates = {
        "Healthy": "Your business demonstrates robust financial discipline with a credit score of {score}. Liquidity is optimized for the {industry} sector.",
        "At Risk": "Financial indicators suggest caution. While revenue is present, your current ratio is trailing the {industry} sector median of {target}.",
        "No Data": "Your financial analysis is ready to begin. Please upload your transaction history to generate your health index.",
    }
    
    target = metrics.get("metrics", {}).get("target_benchmark", 1.5)
    template = templates.get(status, "Please upload your financial documents to generate your first assessment.")
    
    return template.format(score=score, industry=industry, target=target)

def recommend_financial_products(metrics: Dict, industry: str) -> List[Dict]:
    """
    AI-driven product recommendations from banks and NBFCs.
    """
    score = metrics.get("overall_score", 0)
    recommendations = []
    
    if score > 80:
        recommendations.append({
            "product": "Unsecured Business Expansion Loan",
            "provider": "Tier-1 Bank",
            "est_rate": "8.5% - 10%",
            "reason": "High creditworthiness"
        })
    elif score > 60:
        recommendations.append({
            "product": "Working Capital Overdraft",
            "provider": "SME-Focused NBFC",
            "est_rate": "11% - 13%",
            "reason": "Standard liquidity support"
        })
    else:
        recommendations.append({
            "product": "Invoice Factoring",
            "provider": "Fintech Partner",
            "est_rate": "Variable",
            "reason": "Immediate cashflow required"
        })
        
    return recommendations
