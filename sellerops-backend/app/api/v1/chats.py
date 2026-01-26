from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.db.database import get_db
from app.db.models.chat import Chat
from app.db.models.chat_message import ChatMessage
from app.schemas.chat import ChatCreate, ChatResponse
from app.schemas.chat_message import MessageCreate, MessageResponse
from app.security.deps import get_current_user

router = APIRouter(prefix="/chats", tags=["Chats"])
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
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == user.id)
        .order_by(Chat.created_at.desc())
        .all()
    )
    return chats

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

    message = ChatMessage(
        chat_id=chat.id,
        role="user",
        content=payload.content,
        created_at=datetime.utcnow(),
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message
