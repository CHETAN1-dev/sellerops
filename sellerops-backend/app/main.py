from fastapi import FastAPI
from app.routes import auth, uploads

app = FastAPI(title="SellerOps Backend")


app.include_router(auth.router)
app.include_router(uploads.router)
