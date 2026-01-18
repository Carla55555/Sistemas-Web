from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

#order schema in the database
class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    status: str = Field(default="pending", index=True)  # pending/paid/cancelled
    total: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.now)
    items: List["OrderItem"] = Relationship(back_populates="order")

#schema of an item within an order in the database
class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    product_id: int = Field(foreign_key="product.id", index=True)
    title: str
    unit_price: float
    quantity: int
    order: Optional["Order"] = Relationship(back_populates="items")

#schema for reading an order item on the frontend
class OrderItemRead(SQLModel):
    id: int
    product_id: int
    title: str
    unit_price: float
    quantity: int

#schema for reading an order on the frontend
class OrderRead(SQLModel):
    id: int
    user_id: int
    status: str
    total: float
    created_at: datetime
    items: list[OrderItemRead]
