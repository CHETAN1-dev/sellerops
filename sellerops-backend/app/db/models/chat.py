# app/models/chat.py
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.bse import UUIDMixin
from app.db.database import Base

class Chat(UUIDMixin, Base):
    __tablename__ = "chats"

    user_id = Column(ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship(
        "ChatMessage",
        back_populates="chat",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at.asc()",
    )

    uploads = relationship(
        "Upload",
        back_populates="chat",
        cascade="all, delete-orphan",
    )
