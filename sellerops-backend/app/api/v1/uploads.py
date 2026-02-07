from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
from uuid import UUID

from sqlalchemy.orm import Session

from app.celery.celery_app import celery_app
from app.db.database import get_db
from app.db.models.upload import Upload
from app.db.models.chat import Chat
from app.db.models.chat_message import ChatMessage
from app.db.models.user import User
from app.security.deps import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = Path("app/storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/csv", status_code=201)
async def upload_csv(
    chat_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == user.id)
        .first()
    )

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    file_uuid = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_uuid}_{file.filename}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    upload = Upload(
        user_id=user.id,
        chat_id=chat.id,
        file_path=str(file_path),
        original_filename=file.filename,
        status="pending",
    )

    db.add(upload)
    db.flush()

    db.add(
        ChatMessage(
            chat_id=chat.id,
            role="user",
            content=f"📄 Uploading {file.filename}...",
        )
    )

    db.commit()

    return {
        "message": "CSV uploaded",
        "upload_id": upload.id,
        "chat_id": chat.id,
    }


@router.post("/{upload_id}/process", status_code=202)
def process_csv_upload(
    upload_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    upload = (
        db.query(Upload)
        .join(Chat, Chat.id == Upload.chat_id)
        .filter(Upload.id == upload_id, Chat.user_id == user.id)
        .first()
    )

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if upload.status == "processing":
        raise HTTPException(status_code=400, detail="Upload is already processing")

    if upload.status == "completed":
        raise HTTPException(status_code=400, detail="Upload already processed")

    task = celery_app.send_task("process_sales_csv", args=[upload.id])

    return {
        "message": "CSV processing started",
        "upload_id": upload.id,
        "task_id": task.id,
    }


@router.get("/{upload_id}/status")
def get_upload_status(
    upload_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    upload = (
        db.query(Upload)
        .join(Chat, Chat.id == Upload.chat_id)
        .filter(Upload.id == upload_id, Chat.user_id == user.id)
        .first()
    )

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    return {"upload_id": upload.id, "status": upload.status}
