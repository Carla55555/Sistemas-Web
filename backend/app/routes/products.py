from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from app.dependencies import SessionDep
from app.models.product import Product, ProductPublic

# route prefix /products
router = APIRouter(prefix="/products", tags=["products"])

#endpoint to list products with optional search query
@router.get("", response_model=list[ProductPublic])
def list_products(session: SessionDep, q: str | None = Query(default=None)):
    stmt = select(Product)
    if q:
        stmt = stmt.where(Product.title.contains(q) | Product.description.contains(q))

    return session.exec(stmt).all()

#endpoint to get a product by its id
@router.get("/{product_id}", response_model=ProductPublic)
def get_product(product_id: int, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product
