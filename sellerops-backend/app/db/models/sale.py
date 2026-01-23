from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from app.db.database import Base
from sqlalchemy.orm import relationship

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"), nullable=False)
    order_id = Column(Integer, index=True)
    order_date = Column(Date)
    sku = Column(String, index=True)
    product_category = Column(String)
    units_sold = Column(Integer)
    revenue = Column(Float)
    country = Column(String)
    order_status = Column(String)
    upload = relationship("Upload", back_populates="sales")