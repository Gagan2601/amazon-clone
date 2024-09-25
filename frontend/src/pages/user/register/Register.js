import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../../assests/images/amazon-logo1.png";
import "./Register.css";

function Register({ country = "in" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/auth/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
      <div className="signup-container">
        <h3>Create Account</h3>
        <form onSubmit={handleRegister}>
          <label htmlFor="name">Your name</label>
          <input
            className="input"
            type="text"
            id="name"
            placeholder="First and last name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
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
            Sign Up
          </button>
        </form>
        <div className="blur-line"></div>

        <p>
          Already have an account? <Link to="/user/signin">Sign in</Link>
          <br />
          Buying for work?{" "}
          <Link to="/seller/register">Create a free business account</Link>
        </p>
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

export default Register;
