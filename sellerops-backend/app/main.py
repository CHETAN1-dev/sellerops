from fastapi import FastAPI
from app.api.v1 import chats, uploads
from app.routes import auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="SellerOps Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite
        "http://127.0.0.1:5173",
    ],  # later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],  # THIS allows OPTIONS
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(uploads.router)
app.include_router(chats.router)
