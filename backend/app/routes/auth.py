from fastapi import APIRouter, HTTPException, Header
from fastapi import Depends
from sqlmodel import select
from app.dependencies import SessionDep
from app.dependencies import get_current_user
from app.models.user import User, UserCreate, UserLogin, UserPublic
from app.security import hash_password, verify_password, create_access_token, decode_token

# route prefix /auth
router = APIRouter(prefix="/auth", tags=["auth"])

#register a new user
@router.post("/register", response_model=UserPublic)
def register(data: UserCreate, session: SessionDep):
    #check if the email is already registered
    existing = session.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    #create a new user with the password hashed
    user = User(email=data.email, password_hash=hash_password(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

#login an existing user
@router.post("/login")
def login(data: UserLogin, session: SessionDep):
    #find the user by email
    user = session.exec(select(User).where(User.email == data.email)).first()
    #check if the user exists and the password is correct
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    #create a token for the user
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

#get current user
@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return user
