# from app.database import engine
# from app.models import Job  # IMPORTANT: import the model

# print("Creating tables...")
# from app.database import Base
# Base.metadata.create_all(bind=engine)
# print("✅ Tables created")
from app.database import engine
from app.models import Base

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created")
