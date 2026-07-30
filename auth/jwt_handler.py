import os
from dotenv import load_dotenv
from datetime import timedelta, datetime, timezone

from jose import jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE = timedelta(minutes=int(os.getenv("TIME")))

def createAccessToken(data: dict):
    payload = data.copy()

    expire = datetime.now(timezone.utc) + ACCESS_TOKEN_EXPIRE

    payload.update({"exp": expire})

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )