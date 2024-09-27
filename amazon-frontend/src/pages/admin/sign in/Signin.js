import React, { useState } from "react";
import BrandLogo from "../../../assests/images/amazon-logo1.png";
import { Link, useNavigate } from "react-router-dom";
import "../../seller/sign in/Signin.css";

function AdminSignIn({ country = "in", onSignIn, setData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const handleSignIn = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/auth/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("seller_id", data.entity._id);
        onSignIn(data);
        setData(data);
        // navigate("/seller");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <div className="logo-container">
        <a href="/" className="logo1">
          <img className="logo1_img" alt="Amazon" src={BrandLogo} />
          {country && <span className="logo1_country">.{country}</span>}
        </a>
      </div>
      <div className="signin-container">
        <h3>Admin Sign in</h3>
        <form onSubmit={handleSignIn}>
          <label htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            className="input"
            type="password"
            id="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Sign In
          </button>
        </form>
        <hr />
        <p className="new-to-business">New to Business?</p>
        <Link to="/seller/register" className="link">
          <button className="button2" type="submit">
            Create your Amazon account
          </button>
        </Link>
      </div>
      <div className="blur-line"></div>
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Amazon.in, Inc. or its affiliates
        </p>
      </footer>
    </div>
  );
}

export default AdminSignIn;
