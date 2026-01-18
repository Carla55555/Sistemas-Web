from typing import Annotated
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from sqlmodel import Session
from app.db import engine
from app.models.user import User
from app.security import decode_token

# Dependency to get a database session
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
#bearer token scheme
bearer_scheme = HTTPBearer()

# Dependency to get the current authenticated user
def get_current_user(session: SessionDep,credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> User:
    #extract token
    token = credentials.credentials
    #decode token 
    payload = decode_token(token)
    #get user id from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    #get user from database
    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
