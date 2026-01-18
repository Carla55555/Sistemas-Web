from typing import Optional
from sqlmodel import SQLModel, Field

#user schema in the database
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    #save hashed password(we dont save real passwords)
    password_hash: str

#schema for reading a user on the frontend
class UserPublic(SQLModel):
    id: int
    email: str

#schema for creating a new user
class UserCreate(SQLModel):
    email: str
    password: str

#schema for user login
class UserLogin(SQLModel):
    email: str
    password: str
