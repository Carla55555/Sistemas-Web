from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models.product import Product
from app.routes.health import router as health_router
from app.routes.products import router as products_router
from app.routes.auth import router as auth_router
from app.routes.checkout import router as checkout_router
from app.routes.orders import router as orders_router

#function that runs when the app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        first = session.exec(select(Product)).first()
        if first is None:
            session.add_all([
                Product(title="Basic T-shirt", description="White t-shirt, 100% cotton, very comfortable for daily rutine.", price=22.99, stock=25),
                Product(title="Hoodie", description="Black hoodie with brand logo on back, hand wash.", price=64.90, stock=12),
                Product(title="Necklace", description="Gold necklace with a star charm.", price=13.50, stock=40),
                Product(title="Coat", description="Brown long coat, made in Spain.", price=114.95, stock=18),
                Product(title="Cap", description="Blue cap with USJ logo.", price=9.99, stock=20),
                Product(title="Bag", description="Black bag with two compartments, medium size", price=30.80, stock=30),
            ])
            session.commit()
    yield

#create the FastAPI app
app = FastAPI(title="E-Commerce API", lifespan=lifespan)

#enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#include the routers
app.include_router(health_router)
app.include_router(products_router)
app.include_router(auth_router)
app.include_router(checkout_router)
app.include_router(orders_router)