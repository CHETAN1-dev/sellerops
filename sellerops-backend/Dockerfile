FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default command (can be overridden in docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ## Step 3: Create/Update `requirements.txt`
# ```
# fastapi==0.109.0
# uvicorn[standard]==0.27.0
# sqlalchemy==2.0.25
# psycopg2-binary==2.9.9
# celery==5.3.6
# redis==5.0.1
# pydantic==2.5.3
