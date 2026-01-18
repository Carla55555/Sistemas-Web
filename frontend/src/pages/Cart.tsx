import { useEffect, useState } from "react";
import { getCart, clearCart, type CartItem } from "../api/cart";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";

//function that shows the cart page(products added and allows to buy or clear the cart)
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const [buyError, setBuyError] = useState("");

  //get the cart from local storage
  useEffect(function () {
    const cartItems = getCart();
    setItems(cartItems);
  }, []);

  //calculate the total price of the cart
  function getTotal() {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total = total + items[i].price * items[i].quantity;
    }
    return total;
  }

  //function to clear the cart
  function handleClear() {
    clearCart();
    setItems([]);
  }

  //function to buy the products in the cart
  function handleBuy() {
    setBuyError("");

  const token = localStorage.getItem("access_token");
  if (!token) {
    // you are not logged in -> Log in
    navigate("/login");
    return;
  }

  // convert cart items to backend format
  const payloadItems = [];
  for (let i = 0; i < items.length; i++) {
    payloadItems.push({
      product_id: items[i].product_id,
      quantity: items[i].quantity,
    });
  }

  //create the order in the backend
  createOrder(payloadItems)
    .then(function () {
      //if the order is successful, clear the cart and go to order page
      clearCart();
      setItems([]);
      navigate("/orders");
    })
    .catch(function (e) {
    if (e.message) {
      setBuyError(String(e.message));
    } 
    else {
      setBuyError(String(e));
    }
  });
}

  return (
    <div>
      <h1>Cart</h1>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.length > 0 && (
        <div>
          <ul>
            {items.map(function (it) {
              return (
                <li key={it.product_id}>
                  {it.title} — {it.price}€ x {it.quantity}
                </li>
              );
            })}
          </ul>
          <p><b>Total:</b> {getTotal()}€</p>
          {buyError !== "" && <p style={{ color: "red" }}>{buyError}</p>}
          <div className="cartButtons">
            <button className="buyBtn" onClick={handleBuy}>Buy</button>
            <button className="clearBtn" onClick={handleClear}>Clear cart</button>
          </div>
        </div>
      )}
    </div>
  );
}
