from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.ingestion import process_file
from ...models.financial import Transaction

router = APIRouter()

@router.post("/upload")
async def upload_financial_document(
    business_id: str = None, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    if not business_id or business_id == "undefined" or business_id == "null":
        raise HTTPException(status_code=400, detail="Business ID is required. Please re-login.")
    
    try:
        b_id = int(business_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid Business ID: {business_id}")

    print(f"Received upload for business {b_id}: {file.filename}")
    
    # 1. Process File
    try:
        transactions_data = await process_file(file)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # 2. Save to DB
    saved_count = 0
    try:
        for t_data in transactions_data:
            db_transaction = Transaction(**t_data, business_id=b_id)
            db.add(db_transaction)
            saved_count += 1
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    
    return {
        "message": "File processed successfully", 
        "transactions_count": saved_count,
        "sample": transactions_data[:3]
    }
