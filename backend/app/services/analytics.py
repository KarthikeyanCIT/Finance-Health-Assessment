from typing import List, Dict
import pandas as pd
from ..models.financial import IndustryType

def calculate_industry_ratios(transactions: List[dict], industry: str) -> Dict:
    df = pd.DataFrame(transactions)
    if df.empty:
        return {
            "overall_score": 0,
            "metrics": {
                "current_ratio": 0,
                "net_margin": 0,
                "target_benchmark": 0,
                "status": "No Data"
            },
            "industry_insights": ["Please upload financial data to begin analysis."]
        }
    
    # Calculate base metrics
    total_income = df[df['transaction_type'] == 'Income']['amount'].sum()
    total_expense = df[df['transaction_type'] == 'Expense']['amount'].sum()
    
    # Simple Liquidity Check
    cash_in = total_income
    cash_out = total_expense
    current_ratio = cash_in / cash_out if cash_out > 0 else cash_in
    
    # Industry Specific Benchmarking
    # Reference values for "Good" current ratios by industry
    benchmarks = {
        IndustryType.MANUFACTURING.value: {"current_ratio": 1.5, "net_margin": 0.10},
        IndustryType.RETAIL.value: {"current_ratio": 1.2, "net_margin": 0.05},
        IndustryType.SERVICES.value: {"current_ratio": 2.0, "net_margin": 0.15},
        IndustryType.ECOMMERCE.value: {"current_ratio": 1.3, "net_margin": 0.08},
        IndustryType.LOGISTICS.value: {"current_ratio": 1.4, "net_margin": 0.07},
        IndustryType.AGRICULTURE.value: {"current_ratio": 1.1, "net_margin": 0.12},
    }
    
    config = benchmarks.get(industry, benchmarks[IndustryType.SERVICES.value])
    target_ratio = config["current_ratio"]
    target_margin = config["net_margin"]
    
    current_margin = (total_income - total_expense) / total_income if total_income > 0 else 0
    
    bench_status = "Healthy" if current_ratio >= target_ratio else "At Risk"
    
    # Calculate proprietary Creditworthiness Score (0-100)
    # Weighted: 40% Liquidity, 40% Profitability, 20% Scale
    liquidity_score = min(1.0, current_ratio / target_ratio) * 40
    profit_score = min(1.0, current_margin / target_margin) * 40 if target_margin > 0 else 0
    scale_score = min(1.0, total_income / 1000000) * 20 # Cap scale at $1M for SMEs
    credit_score = int(liquidity_score + profit_score + scale_score)

    # Industry Specific Insights
    insights = []
    if current_ratio < target_ratio:
        insights.append(f"Your liquidity is below the {industry} industry benchmark ({target_ratio}).")
    if current_margin < target_margin:
        insights.append(f"Operating margins are underperforming against peers. Target: {target_margin*100}%.")

    return {
        "overall_score": credit_score,
        "metrics": {
            "current_ratio": round(current_ratio, 2),
            "net_margin": round(current_margin, 4),
            "target_benchmark": target_ratio,
            "status": bench_status
        },
        "industry_insights": insights
    }

def optimize_working_capital(transactions: List[dict]):
    # Logic to identify payable/receivable gaps
    # For now, a placeholder for the advanced engine
    return {
        "suggestion": "Convert accounts receivable into cash faster via factoring.",
        "impact": "Lowers burn rate by 12%"
    }
def get_timeseries_data(transactions: List[dict]):
    if not transactions:
        return []
        
    df = pd.DataFrame(transactions)
    # Ensure date is datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by date
    df = df.sort_values('date')
    
    # Group by month and sum income (as 'value' for simplicity in charts)
    # Filter only Income for the main trajectory chart
    income_df = df[df['transaction_type'] == 'Income'].copy()
    if income_df.empty:
        # Fallback to total sum if no income
        income_df = df.copy()

    # Aggregate by month
    monthly = income_df.resample('ME', on='date')['amount'].sum().reset_index()
    monthly['name'] = monthly['date'].dt.strftime('%b')
    monthly['value'] = monthly['amount'].round(2)
    
    return monthly[['name', 'value']].to_dict('records')
