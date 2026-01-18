from fastapi import APIRouter
from sqlmodel import select
from app.dependencies import SessionDep
from app.models.product import Product
from sqlmodel import SQLModel

# route prefix /checkout
router = APIRouter(prefix="/checkout", tags=["checkout"])

#schma for an item in the cart
class CartItem(SQLModel):
    product_id: int
    quantity: int

#schema for the cart validation
class CartValidateRequest(SQLModel):
    items: list[CartItem]

#schema for validate an item
class ValidatedItem(SQLModel):
    product_id: int
    title: str
    unit_price: float
    quantity: int
    line_total: float

#schema for the cart validation response
class CartValidateResponse(SQLModel):
    valid: list[ValidatedItem]
    invalid: list[dict]
    total: float

#endpoint to validate the cart
@router.post("/validate", response_model=CartValidateResponse)
def validate_cart(data: CartValidateRequest, session: SessionDep):
    invalid: list[dict] = []
    valid: list[ValidatedItem] = []
    total = 0.0

    #check if each item is valid
    for item in data.items:
        #quantity must be at least 1
        if item.quantity < 1:
            invalid.append({"product_id": item.product_id, "reason": "Quantity must be >= 1"})
            continue

        #check if the product exists
        product = session.get(Product, item.product_id)
        if not product:
            invalid.append({"product_id": item.product_id, "reason": "Product not found"})
            continue

        
        if item.quantity > product.stock:
            invalid.append({
                "product_id": item.product_id,
                "reason": f"Not enough stock (requested {item.quantity}, available {product.stock})"
            })
            continue

        line_total = product.price * item.quantity
        total += line_total

        #add to the list of valid items
        valid.append(ValidatedItem(
            product_id=product.id,
            title=product.title,
            unit_price=product.price,
            quantity=item.quantity,
            line_total=line_total
        ))

    return CartValidateResponse(valid=valid, invalid=invalid, total=total)
