# app/models/chat_message.py
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.bse import UUIDMixin
from app.db.database import Base

class ChatMessage(UUIDMixin, Base):
    __tablename__ = "chat_messages"

    chat_id = Column(
        ForeignKey("chats.id", ondelete="CASCADE"),
        nullable=False,
    )

    role = Column(String(20), nullable=False)  
    # user | assistant | system

    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chat = relationship("Chat", back_populates="messages")
