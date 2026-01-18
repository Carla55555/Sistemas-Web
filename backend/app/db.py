import os
from sqlmodel import SQLModel, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

DATABASE_URL = os.getenv("DATABASE_URL", sqlite_url)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)

def create_db_and_tables():
    from app.models.product import Product
    from app.models.user import User
    from app.models.order import Order, OrderItem
    SQLModel.metadata.create_all(engine)


