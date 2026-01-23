from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

from app.celery.celery_app import celery_app
from app.db.database import get_db
from app.db.models.upload import Upload
from app.db.models.user import User
from app.security.deps import get_current_user
from sqlalchemy.orm import Session

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = Path("app/storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),  # ✅ correct
):
    # 1️⃣ Validate file
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # 2️⃣ Save file
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3️⃣ Save upload record (USER LINKED)
    upload = Upload(
        user_id=user.id,
        file_path=str(file_path),
        original_filename=file.filename,
        status="pending",
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    # 4️⃣ Send upload_id to Celery (NOT file path)
    task = celery_app.send_task(
        "process_sales_csv",
        args=[upload.id],
    )

    return {
        "message": "CSV uploaded & processing started",
        "upload_id": upload.id,
        "task_id": task.id,
    }
