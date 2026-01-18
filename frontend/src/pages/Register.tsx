import { useState } from "react";
import { Link } from "react-router-dom";
import { register, login } from "../api/auth";

//function that allows user to create an account
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //function executed when the register form is submitted
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    register(email, password)
      .then(function () {
        // after registering, automatically log the user in
        return login(email, password);
      })
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
        <h1>Create account</h1>
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
          <button type="submit" className="primaryBtn">Create account</button>
        </form>
        <p className="authLinks">
          <Link to="/login">Already have an account? Login</Link>
        </p>
      </div>
    </div>
  );
}
