from datetime import datetime, timedelta
from jose import JWTError, jwt
from uuid import uuid4

SECRET_KEY = "CHANGE_ME_LATER"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=60)

    payload = {
        "sub": subject,
        "exp": expire,
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)



def create_refresh_token():
    return str(uuid4())


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
