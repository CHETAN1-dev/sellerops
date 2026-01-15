from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = Path("app/storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    # 1. Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # 2. Create unique filename
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    # 3. Save file to disk
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Return metadata (future job trigger will go here)
    return {
        "message": "CSV uploaded successfully",
        "file_id": file_id,
        "filename": file.filename,
        "path": str(file_path)
    }
