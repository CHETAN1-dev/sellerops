from app.db.database import engine
from app.db.models.models import Base , Job , Sale
print("Creating tables")
Base.metadata.create_all(bind=engine)
print("✅ Tables created")
