import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Register from "./pages/Register";


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <ProductList /> },
      { path: "/products/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/login", element: <Login /> },
      { path: "/orders", element: <Orders /> },
      { path: "/register", element: <Register /> },

    ],
  },
]);
