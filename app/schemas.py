from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    seller_id: int
    type: str

class JobResponse(BaseModel):
    id: int
    seller_id: int
    type: str
    status: str
    error_message: Optional[str]

    class Config:
        orm_mode = True
