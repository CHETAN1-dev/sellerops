from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from app.models import Base
from app.routes import health, jobs, uploads


app = FastAPI(title="SellerOps Backend")

app.include_router(jobs.router)
app.include_router(health.router)
app.include_router(uploads.router)