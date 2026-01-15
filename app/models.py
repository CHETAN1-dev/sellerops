# from sqlalchemy import Column, Integer, String, DateTime, JSON
# from datetime import datetime
# from app.database import Base

# class Job(Base):
#     __tablename__ = "jobs"

#     id = Column(Integer, primary_key=True)
#     seller_id = Column(Integer, index=True)
#     type = Column(String)
#     status = Column(String, index=True)

#     result = Column(JSON, nullable=True)
#     error_message = Column(String, nullable=True)

#     created_at = Column(DateTime, default=datetime.utcnow)
#     started_at = Column(DateTime, nullable=True)
#     completed_at = Column(DateTime, nullable=True)
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, index=True)
    type = Column(String)
    status = Column(String, index=True)

    result = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
