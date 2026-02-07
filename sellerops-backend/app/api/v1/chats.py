from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.ai.generate_answer import generate_human_answer
from app.ai.sql_executor import execute_ai_sql
from app.db.database import get_db
from app.db.models.chat import Chat
from app.db.models.chat_message import ChatMessage
from app.db.models.upload import Upload
from app.schemas.chat import ChatCreate, ChatResponse
from app.schemas.chat_message import MessageCreate, MessageResponse
from app.security.deps import get_current_user

router = APIRouter(prefix="/chats", tags=["Chats"])

_PLACEHOLDER_TITLES = {"", "new chat", "untitled chat"}


def _can_auto_name(chat: Chat) -> bool:
    return (chat.title or "").strip().lower() in _PLACEHOLDER_TITLES


@router.post("", response_model=ChatResponse, status_code=201)
def create_chat(
    payload: ChatCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    chat = Chat(
        user_id=user.id,
        title=payload.title,
        created_at=datetime.utcnow(),
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


@router.get("", response_model=list[ChatResponse])
def list_chats(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    latest_message_at = func.max(ChatMessage.created_at)
    latest_upload_at = func.max(Upload.created_at)
    latest_activity = func.greatest(
        Chat.created_at,
        func.coalesce(latest_message_at, Chat.created_at),
        func.coalesce(latest_upload_at, Chat.created_at),
    )

    chats = (
        db.query(Chat)
        .outerjoin(ChatMessage, ChatMessage.chat_id == Chat.id)
        .outerjoin(Upload, Upload.chat_id == Chat.id)
        .filter(Chat.user_id == user.id)
        .group_by(Chat.id)
        .order_by(latest_activity.desc())
        .all()
    )
    return chats


@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat(
    chat_id: UUID,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == user.id)
        .first()
    )

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
def get_messages(
    chat_id: UUID,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == user.id)
        .first()
    )

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat.messages


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=201)
def add_message(
    chat_id: UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id, Chat.user_id == user.id)
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    prior_user_message_count = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat.id, ChatMessage.role == "user")
        .count()
    )

    user_message = ChatMessage(
        chat_id=chat.id,
        role="user",
        content=payload.content,
        created_at=datetime.utcnow(),
    )
    db.add(user_message)

    has_upload = db.query(Upload.id).filter(Upload.chat_id == chat.id).first() is not None
    if prior_user_message_count == 0 and not has_upload and _can_auto_name(chat):
        chat.title = payload.content.strip()[:80] or "New Chat"

    db.commit()

    upload_ids = (
        db.query(Upload.id)
        .filter(
            Upload.chat_id == chat_id,
            Upload.status == "completed",
        )
        .all()
    )
    upload_ids = [u.id for u in upload_ids]

    if not upload_ids:
        raise HTTPException(
            status_code=400,
            detail="Please upload and process a CSV file before asking questions.",
        )

    sql = """
    SELECT sku, SUM(revenue) AS total_revenue
    FROM sales
    GROUP BY sku
    ORDER BY total_revenue DESC
    LIMIT 5
    """

    rows = execute_ai_sql(
        db=db,
        sql=sql,
        upload_ids=upload_ids,
    )

    _ = generate_human_answer(
        question=payload.content,
        sql=sql,
        rows=rows,
    )

    answer = f"Found {len(rows)} results."

    assistant_message = ChatMessage(
        chat_id=chat.id,
        role="assistant",
        content=answer,
        created_at=datetime.utcnow(),
    )
    db.add(assistant_message)
    db.commit()

    return assistant_message
