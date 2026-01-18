from datetime import datetime, timedelta
from typing import Any
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = "carla-ecommerce"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  * 7  #7 days

#password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#convert a normal password into a hashed password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

#check if a normal password matches the hashed password
def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

#create a token for the user
def create_access_token(data: dict[str, Any], expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#decode the token to get the user data
def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return {}
