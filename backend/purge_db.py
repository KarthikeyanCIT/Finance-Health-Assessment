from app.core.database import engine, Base
from sqlalchemy import text

def wipe_db():
    print("WARNING: Wiping all data from financial_platform.db...")
    
    # Drop all tables via SQL to be absolutely sure
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS transactions"))
        conn.execute(text("DROP TABLE IF EXISTS businesses"))
        conn.execute(text("DROP TABLE IF EXISTS transaction"))
        conn.execute(text("DROP TABLE IF EXISTS business_context"))
        conn.commit()
    
    # Re-create tables
    Base.metadata.create_all(bind=engine)
    print("Database wiped and tables re-created successfully.")

if __name__ == "__main__":
    wipe_db()
