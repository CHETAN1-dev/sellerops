from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    status = Column(String, default="processing")
    # processing | completed | failed

    created_at = Column(DateTime, default=datetime.utcnow)

    sales = relationship(
        "Sale",
        back_populates="upload",
        cascade="all, delete-orphan"
      )