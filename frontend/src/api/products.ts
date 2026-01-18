//define the structure of a product
export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

//function to get the list of products
export async function listProducts(): Promise<Product[]> {
  const res = await fetch(API_BASE + "/products");

  if (!res.ok) {
    throw new Error("Error fetching products: " + res.status);
  }

  return res.json();
}

//function to get a single product by its id
export async function getProduct(productId: number): Promise<Product> {
  const res = await fetch(API_BASE + "/products/" + productId);

  if (!res.ok) {
    throw new Error("Error fetching product: " + res.status);
  }

  return res.json();
}
