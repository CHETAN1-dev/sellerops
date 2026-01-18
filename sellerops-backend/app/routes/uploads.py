from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

from app.celery.celery_app import celery_app
from app.db.models.user import User
from app.security.deps import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = Path("app/storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    # 1️⃣ Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # 2️⃣ Create user-scoped filename
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{user.id}_{file_id}_{file.filename}"

    # 3️⃣ Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4️⃣ Background processing
    task = celery_app.send_task(
        "process_sales_csv",
        args=[str(file_path), user.id]
    )

    return {
        "message": "CSV uploaded & processing started",
        "file_id": file_id,
        "task_id": task.id
    }
