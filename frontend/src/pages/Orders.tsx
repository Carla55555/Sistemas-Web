import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders } from "../api/orders";

//define items inside an order
type OrderItem = {
  id: number;
  product_id: number;
  title: string;
  unit_price: number;
  quantity: number;
};

//define orders
type Order = {
  id: number;
  user_id: number;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

//function to format the date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return day + "/" + month + "/" + year + " - " + hours + ":" + minutes;
}

//function that shows all orders of the logged in user
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //ckeck if the user is logged in and get the orders
  useEffect(function () {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    //get the orders from the backend
    listOrders()
      .then(function (data) {
        setOrders(data);
      })
      .catch(function (e) {
        if (e.message) {
          setError(String(e.message));
        } 
        else {
          setError(String(e));
        }
      });
  }, [navigate]);

  return (
    <div>
      <h1>Orders</h1>
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
      {orders.length === 0 && error === "" && (
        <p>No orders yet. <Link to="/">Go to products</Link></p>
      )}

      {orders.map(function (o) {
        return (
          <div key={o.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
            <p><b>Order #{o.id}</b> — {o.status}</p>
            <p><b>Total:</b> {o.total}€</p>
            <p><b>Created:</b> {formatDate(o.created_at)}</p>
            <p><b>Items:</b></p>
            <ul>
              {o.items.map(function (it) {
                return (
                  <li key={it.id}>
                    {it.title} — {it.unit_price}€ x {it.quantity}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
