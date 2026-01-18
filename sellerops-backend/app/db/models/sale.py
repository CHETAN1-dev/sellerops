from sqlalchemy import Column, Date, Float, Integer, String
from app.db.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, index=True)
    order_date = Column(Date)
    sku = Column(String, index=True)
    product_category = Column(String)
    units_sold = Column(Integer)
    revenue = Column(Float)
    country = Column(String)
    order_status = Column(String)