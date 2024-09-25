import React from "react";
import Logo from "./Logo";
import Location from "./Location";
import "./Navbar.css";
import Search from "./Search";
import Account from "./Account";
import Orders from "./Orders";
import Cart from "./Cart";
import LanguageDropdown from "./Language";

function Navbar({ isSignedIn, data, saveAddress, address, cartCount }) {
  return (
    <nav className="navbar fixed-top bg-body-tertiary navbar-expand-lg navbar-dark bg-dark">
      <Logo />
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <Location
          isSignedIn={isSignedIn}
          data={data}
          saveAddress={saveAddress}
          address={address}
        />
        <Search />
        <LanguageDropdown />
        <Account isSignedIn={isSignedIn} data={data} />
        <Orders />
        <Cart cartCount={cartCount} />
      </div>
    </nav>
  );
}

export default Navbar;
