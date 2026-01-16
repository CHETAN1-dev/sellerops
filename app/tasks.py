from datetime import datetime
from app.celery.celery_app import celery_app
from app.db.database import SessionLocal
from app.db.models.models import Job

@celery_app.task(name="app.tasks.process_job")
def process_job(job_id: int):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return

        job.status = "processing"
        job.started_at = datetime.utcnow()
        db.commit()

        print("🔥 PROCESSING JOB:", job_id)

        # --- REAL WORK STARTS HERE ---
        previous_jobs = (
            db.query(Job)
            .filter(Job.seller_id == job.seller_id)
            .filter(Job.status == "completed")
            .count()
        )

        insights = {
            "message": "Daily insights generated",
            "total_completed_jobs": previous_jobs,
            "recommendation": "Increase ad spend on top 3 SKUs",
        }

        job.result = insights
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        db.commit()

        print("✅ JOB COMPLETED:", job_id)

    except Exception as e:
        job.status = "failed"
        job.error_message = str(e)
        db.commit()

    finally:
        db.close()
