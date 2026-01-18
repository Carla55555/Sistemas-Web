const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

//function to get the token
function getToken(): string | null {
  return localStorage.getItem("access_token");
}

//define the structure of an item to create an order
export type CreateOrderItem = {
  product_id: number;
  quantity: number;
};

//function to create a new order
export async function createOrder(items: CreateOrderItem[]) {
  // get the token to check if the user is logged in
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }

  const res = await fetch(API_BASE + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "Accept": "application/json",
    },
    body: JSON.stringify({ items: items }),
  });

  if (!res.ok) {
    let message = "Error creating order: " + res.status;
    try {
      const data = await res.json();
      if (data && data.detail) {
        message = String(data.detail);
      }
    } 
    catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

//function to get all orders of the logged in user
export async function listOrders() {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in");
  }

  const res = await fetch(API_BASE + "/orders", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    let message = "Error fetching orders: " + res.status;
    try {
      const data = await res.json();
      if (data && data.detail) {
        message = String(data.detail);
      }
    } 
    catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}
