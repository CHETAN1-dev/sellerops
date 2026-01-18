import redis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

OTP_PREFIX = "otp:"

def get_otp(email: str) -> str | None:
    return redis_client.get(f"{OTP_PREFIX}{email}")

def delete_otp(email: str):
    redis_client.delete(f"{OTP_PREFIX}{email}")
