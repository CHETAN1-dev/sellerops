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
    # 1️⃣ Validate file
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # 2️⃣ Validate chat belongs to user
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == user.id)
        .first()
    )

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # 3️⃣ Save file to disk
    file_uuid = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_uuid}_{file.filename}"

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4️⃣ Create upload record (linked to chat)
    upload = Upload(
        user_id=user.id,
        chat_id=chat.id,
        file_path=str(file_path),
        original_filename=file.filename,
        status="processing",
    )

    db.add(upload)
    db.commit()
    db.refresh(upload)

    # 5️⃣ Add system message to chat
    system_message = ChatMessage(
        chat_id=chat.id,
        role="system",
        content=f"📄 Uploaded `{file.filename}`. Processing started.",
    )

    db.add(system_message)
    db.commit()

    # 6️⃣ Trigger Celery task
    task = celery_app.send_task(
        "process_sales_csv",
        args=[upload.id],
    )

    return {
        "message": "CSV uploaded and processing started",
        "upload_id": upload.id,
        "chat_id": chat.id,
        "task_id": task.id,
    }
