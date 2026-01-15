from app.database import engine
from app.models import Base , Job 
print("Creating tables")
Base.metadata.create_all(bind=engine)
print("✅ Tables created")
