from fastapi import FastAPI
from sqlalchemy import text
from app.db.database import engine
from app.db.models.models import Base
from app.routes import health, jobs, uploads


app = FastAPI(title="SellerOps Backend")

app.include_router(jobs.router)
app.include_router(health.router)
app.include_router(uploads.router)