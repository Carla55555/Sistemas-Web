import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts, type Product } from "../api/products";

//function that shows the list of products
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  //get the products list from the backend
  useEffect(function () {
    listProducts()
      .then(function (data) {
        setProducts(data);
      })
      .catch(function (e) {
        if (e.message) {
          setError(e.message);
        } 
        else {
          setError(String(e));
        }
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="productsGrid">
        {products.map(function (p) {
          return (
            <li key={p.id} className="productCard">
              <img
                className="productImage"
                src={"/images/" + p.id + ".png"}
                alt={p.title}
              />
              <Link to={"/products/" + p.id} className="productTitle">{p.title}</Link>
              <div className="productInfo">
                <span>{p.price}€</span>
                <span>stock: {p.stock}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
