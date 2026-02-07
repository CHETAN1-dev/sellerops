from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, llm
from app.api.v1 import chats, uploads

app = FastAPI(title="SellerOps Backend")

# --------------------
# CORS
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Routers
# --------------------
app.include_router(auth.router)
app.include_router(uploads.router)
app.include_router(chats.router)
app.include_router(llm.router)
