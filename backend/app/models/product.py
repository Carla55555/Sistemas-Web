from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

#product schema in the database
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = ""
    price: float
    stock: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

#schema for reading a product on the frontend
class ProductPublic(SQLModel):
    id: int
    title: str
    description: str
    price: float
    stock: int
