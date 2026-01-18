import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import { me } from "../api/auth";

//layout component that includes header and navigation
export default function Layout() {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);

  //check if the token is valid calling the me endpoint
  useEffect(function () {
    me().then(function (user) {
      if (user) {
        //if a user is returned, the user is logged in
        setLogged(true);
      } 
      else {
        //if no user is returned, the token is invalid or missing
        localStorage.removeItem("access_token");
        setLogged(false);
      }
    });
  }, []);

  //function to logout the user
  function handleLogout() {
    localStorage.removeItem("access_token");
    setLogged(false);
    navigate("/login");
  }

  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <div className="brand">My Store</div>

          <nav className="nav">
            <NavLink to="/">Products</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            {!logged && <NavLink to="/login">Login</NavLink>}
            {logged && (
              <button type="button" className="logoutBtn" onClick={handleLogout}>Logout</button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
