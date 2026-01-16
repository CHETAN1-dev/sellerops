from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.models import Job
from app.schemas import JobCreate, JobResponse
from app.tasks import process_job   # 👈 THIS IMPORT MATTERS

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=JobResponse)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = Job(
        seller_id=payload.seller_id,
        type=payload.type,
        status="pending"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    print("🚀 SENDING TASK TO CELERY:", job.id)  # 👈 ADD THIS
    process_job.delay(job.id)
