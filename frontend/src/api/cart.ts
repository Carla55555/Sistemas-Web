const CART_KEY = "cart_items";

//define the structure of a cart item
export type CartItem = {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
};

//function to get the current cart from local storage
export function getCart(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CartItem[];
  } 
  catch (e) {
    // If it's corrupt, we clean it up
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

//save the cart in local storage
export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

//clear the cart from local storage
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
