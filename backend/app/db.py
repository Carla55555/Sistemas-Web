import os
from sqlmodel import SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
else:
    sqlite_file_name = "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    from app.models.product import Product
    from app.models.user import User
    from app.models.order import Order, OrderItem
    SQLModel.metadata.create_all(engine)

