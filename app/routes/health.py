from fastapi import APIRouter
from sqlalchemy import text
from app.database import engine

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/db")
def db_health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"db": "connected"}
