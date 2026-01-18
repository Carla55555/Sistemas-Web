import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, type Product } from "../api/products";
import { getCart, saveCart } from "../api/cart";

//shows the detail of a product and allows to add it to the cart
export default function ProductDetail() {
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  //get the product from the backend
  useEffect(function () {
    if (!productId) {
      setError("Invalid product id");
      return;
    }

    getProduct(productId)
      .then(function (data) {
        setProduct(data);
      })
      .catch(function (e) {
        setError(String(e.message ? e.message : e));
      });
  }, [productId]);

  //function to add the product to the cart
  function addToCart() {
    if (!product) return;
    const cart = getCart();

    // check if it already exists in the cart
    let found = false;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].product_id === product.id) {
        cart[i].quantity = cart[i].quantity + 1;
        found = true;
        break;
      }
    }

    // if it wasn't there, we added it.
    if (!found) {
      cart.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      });
    }
    saveCart(cart);
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/">Back to products</Link>
      </div>
    );
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p><Link to="/">← Back</Link></p>
      <h1>{product.title}</h1>
      <img
        className="detailImage"
        src={"/images/" + product.id + ".png"}
        alt={product.title}
      />
      <p>{product.description}</p>
      <p><b>Price:</b> {product.price}€</p>
      <p><b>Stock:</b> {product.stock}</p>
      <button className="addCartBtn" onClick={addToCart}>Add to cart</button>
    </div>
  );
}
