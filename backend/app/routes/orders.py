from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.dependencies import SessionDep, get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderRead, OrderItemRead
from sqlmodel import SQLModel

# route prefix /orders
router = APIRouter(prefix="/orders", tags=["orders"])

#schema for an item when we create an order
class OrderCreateItem(SQLModel):
    product_id: int
    quantity: int

#schema for creating an order
class OrderCreateRequest(SQLModel):
    items: list[OrderCreateItem]

#endpoint to list orders for the current user
@router.get("", response_model=list[OrderRead])
def list_orders(session: SessionDep, user: User = Depends(get_current_user)):
    #select all orders for the user, ordered by date(newest first)
    stmt = select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
    orders = session.exec(stmt).all()

    result: list[OrderRead] = []
    #for each order, get its items and build the response
    for o in orders:
        items = session.exec(select(OrderItem).where(OrderItem.order_id == o.id)).all()
        result.append(OrderRead(
            id=o.id,
            user_id=o.user_id,
            status=o.status,
            total=o.total,
            created_at=o.created_at,
            items=[
                OrderItemRead(
                    id=i.id,
                    product_id=i.product_id,
                    title=i.title,
                    unit_price=i.unit_price,
                    quantity=i.quantity,
                )
                for i in items
            ]
        ))
    return result


#endpoint to create a new order
@router.post("", response_model=OrderRead)
def create_order(data: OrderCreateRequest, session: SessionDep, user: User = Depends(get_current_user)):
    #check if the cart is empty
    if not data.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 1)validate products and calculate total price
    products_map: dict[int, Product] = {}
    total = 0.0

    for item in data.items:
        if item.quantity < 1:
            raise HTTPException(status_code=400, detail=f"Invalid quantity for product {item.product_id}")

        product = session.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")

        if item.quantity > product.stock:
            raise HTTPException(status_code=400, detail=f"Not enough stock for '{product.title}'")

        products_map[item.product_id] = product
        total += product.price * item.quantity

    # 2) create order
    order = Order(user_id=user.id, status="pending", total=total)
    session.add(order)
    session.commit()
    session.refresh(order)

    # 3) create order items and decrease stock
    for item in data.items:
        product = products_map[item.product_id]

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            title=product.title,
            unit_price=product.price,
            quantity=item.quantity,
        )
        session.add(order_item)

        product.stock -= item.quantity
        session.add(product)

    session.commit()
    session.refresh(order)
    #get all items of the order
    items = session.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()

    return OrderRead(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total=order.total,
        created_at=order.created_at,
        items=[
            OrderItemRead(
                id=i.id,
                product_id=i.product_id,
                title=i.title,
                unit_price=i.unit_price,
                quantity=i.quantity,
            )
            for i in items
        ],
    )

