from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    status = Column(String, default="processing")
    # processing | completed | failed

    created_at = Column(DateTime, default=datetime.utcnow)

    sales = relationship(
        "Sale",
        back_populates="upload",
        cascade="all, delete-orphan"
      )
    
    chat_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chats.id", ondelete="CASCADE"),
        nullable=False,
    )

    chat = relationship("Chat", back_populates="uploads")