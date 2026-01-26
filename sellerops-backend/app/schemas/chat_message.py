from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
