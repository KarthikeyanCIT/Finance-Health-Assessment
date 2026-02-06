import random

async def get_health_score(details: dict) -> dict:
    # Logic to calculate score based on inputs
    # Mocking for reliability
    score = random.randint(70, 85)
    return {
        "overall_score": score,
        "details": {
            "liquidity": "Strong" if score > 75 else "Moderate",
            "profitability": "Growing" if score > 80 else "Stable",
            "solvency": "Safe"
        },
        "narrative": "Based on the recent upload, your financial health is robust. Liquidity ratios are above industry average (1.8 vs 1.2), indicating strong short-term stability. Net margins are healthy at 14.5%."
    }

async def generate_cfo_response(message: str, context: dict) -> str:
    # Mock Chat Logic
    msg = message.lower()
    if "profit" in msg:
        return "Your net profit margin significantly improved last quarter, reaching 14.5%. This is 2.5% higher than the industry median."
    elif "loan" in msg or "borrow" in msg:
        return "Given your strong cash flow and current ratio of 1.8, you are in a good position to secure a working capital loan at favorable rates (approx 9-11%)."
    elif "cost" in msg or "expense" in msg:
        return "Your highest expense category is currently 'Payroll', which is standard for a service-based SME. Rent costs are within normal limits."
    else:
        return "I can help analyze your profits, cash flow trends, or suggest funding options. What would you like to know?"
