from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.security.password import hash_password, verify_password
from app.security.otp import generate_otp
from app.core.redis import redis_client
from app.db.database import get_db
from app.db.models.user import User
from app.schemas.auth import VerifyOtpRequest
from app.services.otp import get_otp, delete_otp
from app.security.jwt import create_access_token
from app.db.models.refresh_token import RefreshToken
from app.security.jwt import create_access_token, create_refresh_token
from datetime import datetime, timedelta



router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=201)
def register(payload: RegisterRequest):
    db: Session = SessionLocal()

    # 1️⃣ Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # 2️⃣ Create user (unverified)
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3️⃣ Generate OTP
    otp = generate_otp()

    # 4️⃣ Store OTP in Redis (5 minutes)
    redis_client.setex(
        f"otp:{user.email}",
        300,
        otp
    )

    # 🚨 TEMP: log OTP (replace with email/SMS later)
    print(f"[OTP] {user.email} -> {otp}")

    return {
        "message": "OTP sent for verification",
        "email": user.email
    }

@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "User already verified"}

    stored_otp = get_otp(payload.email)

    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP expired or invalid")

    if stored_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    db.commit()

    delete_otp(payload.email)

    return {"message": "Account verified successfully"}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db=Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token()

    db.add(
        RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
    )
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(token: str, db=Depends(get_db)):
    record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token)
        .first()
    )

    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access = create_access_token(record.user_id)
    new_refresh = create_refresh_token()

    record.token = new_refresh
    record.expires_at = datetime.utcnow() + timedelta(days=7)
    db.commit()

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(token: str, db=Depends(get_db)):
    db.query(RefreshToken).filter(RefreshToken.token == token).delete()
    db.commit()
    return {"message": "Logged out"}
