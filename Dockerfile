FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY sellerops-frontend/package.json sellerops-frontend/package-lock.json ./
RUN npm ci
COPY sellerops-frontend/ .
RUN npm run build

FROM python:3.11-slim AS backend

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY sellerops-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY sellerops-backend/ .
COPY --from=frontend-builder /frontend/dist ./frontend_dist

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
