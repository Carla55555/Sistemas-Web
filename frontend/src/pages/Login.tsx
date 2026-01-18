import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/auth";

//function that allows user to login
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //function executed when the login form is submitted
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    //call the login function from the API
    login(email, password)
      .then(function () {
        window.location.href = "/";
      })
      .catch(function (err) {
        if (err.message) {
          setError(String(err.message));
        } 
        else {
          setError(String(err));
        }
      });
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <h1>Login</h1>
        {error !== "" && <p className="authError">{error}</p>}
        <form onSubmit={handleSubmit} className="authForm">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
          />

          <button type="submit" className="primaryBtn">Login</button>
        </form>
        <p className="authLinks">
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
