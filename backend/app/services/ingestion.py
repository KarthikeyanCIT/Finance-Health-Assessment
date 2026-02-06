import pandas as pd
from fastapi import UploadFile, HTTPException
import io
from ..models.financial import TransactionType
# from .ai_wrapper import classify_transaction # Will implement later

async def process_file(file: UploadFile) -> list[dict]:
    content = await file.read()
    filename = file.filename.lower()
    df = None
    
    print(f"Processing file: {filename} ({len(content)} bytes)")

    try:
        # Strategy 1: Trust extension
        if filename.endswith('.csv'):
            try:
                df = pd.read_csv(io.BytesIO(content))
            except Exception as e:
                print(f"CSV parse failed: {e}")
        elif filename.endswith(('.xlsx', '.xls')):
            try:
                df = pd.read_excel(io.BytesIO(content))
            except Exception as e:
                print(f"Excel parse failed: {e}")
        
        # Strategy 2: Fallback (if extension lied or failed)
        if df is None:
            print("Attempting fallback to CSV parser...")
            try:
                io.BytesIO(content).seek(0)
                df = pd.read_csv(io.BytesIO(content))
            except:
                pass
        
        if df is None:
            print("Attempting fallback to Excel parser...")
            try:
                io.BytesIO(content).seek(0)
                df = pd.read_excel(io.BytesIO(content))
            except:
                pass

        if df is None:
            raise HTTPException(status_code=400, detail="Could not parse file. Ensure it is a valid CSV or Excel file.")

        # Normalizer
        df.columns = [str(c).lower().strip().replace(' ', '_') for c in df.columns]
        required_cols = ['date', 'description', 'amount']
        missing = [c for c in required_cols if c not in df.columns]
        
        if missing:
             # Try simple heuristic mapping if strict columns missing
             # e.g., 'txn_date' -> 'date', 'desc' -> 'description'
            rename_map = {
                'txn_date': 'date', 'transaction_date': 'date',
                'desc': 'description', 'narrative': 'description',
                'amt': 'amount', 'value': 'amount'
            }
            df.rename(columns=rename_map, inplace=True)
            # Re-check
            missing = [c for c in required_cols if c not in df.columns]
            if missing:
                raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing)}")

        transactions = []
        for _, row in df.iterrows():
            try:
                # Amount cleaning
                raw_amt = row.get('amount', 0)
                if isinstance(raw_amt, str):
                    raw_amt = raw_amt.replace(',', '').replace('$', '').strip()
                amount_float = float(raw_amt)
            except:
                amount_float = 0.0

            # Date cleaning
            raw_date = row.get('date')
            try:
                dt_val = pd.to_datetime(raw_date).to_pydatetime()
            except:
                dt_val = pd.Timestamp.now().to_pydatetime()

            # Type Inference
            t_type = "Expense"
            if amount_float > 0:
                t_type = "Income"
            
            # Auto-categorization (Simple heuristic for now)
            cat = "Uncategorized"
            desc = str(row.get('description', '')).lower()
            if 'rent' in desc: cat = "Rent"
            elif 'salary' in desc or 'payroll' in desc: cat = "Payroll"
            elif 'sales' in desc or 'inv' in desc: cat = "Revenue"

            transactions.append({
                "date": dt_val,
                "description": row.get('description', 'Unknown'),
                "amount": abs(amount_float),
                "transaction_type": t_type,
                "category": cat,
                "source_file": filename
            })
            
        return transactions

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error during processing: {str(e)}")
