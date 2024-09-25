import React, { useState, useEffect } from 'react';
import "./LowerNavbar.css";
import { CgProfile } from "react-icons/cg";
import Icon from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";

function LowerNavbar({ isSignedIn, data }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      if (window.innerWidth < 1890) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);
  return (
    <nav className={`navbar navbar-dark lowernavbar${isVisible ? '' : ' hidden'}`}>
      <div className="container-fluid">
        <button
          className="navbar-toggler lowernavbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
          All
        </button>
        <div className="lowernavbar-content">
          <a className="nav-link" href="#">
            Sell
          </a>
          <a className="nav-link" href="#">
            Best Sellers
          </a>
          <a className="nav-link" href="#">
            Todays's Deals
          </a>
          <a className="nav-link" href="#">
            Mobiles
          </a>
          <a className="nav-link" href="#">
            New Releases
          </a>
          <a className="nav-link" href="#">
            Customer Service
          </a>
          <a className="nav-link" href="#">
            Prime
            <Icon className="prime_arrow" path={mdiMenuDown} size={0.8} />
          </a>
          <a className="nav-link" href="#">
            Electronics
          </a>
          <a className="nav-link" href="#">
            Home & Kitchen
          </a>
          <a className="nav-link" href="#">
            Fashion
          </a>
          <a className="nav-link" href="#">
            Computers
          </a>
          <a className="nav-link" href="#">
            Amazon Pay
          </a>
          <a href="#">
            <img
              alt="Amazon App"
              src="https://m.media-amazon.com/images/G/31/IN-hq/2021/img/Mobile_Traffic_/XCM_Manual_1321458_1651511_IN_3781247_400x39_en_IN._CB655944656_.jpg"
            />
          </a>
        </div>

        <div
          className="offcanvas offcanvas-start text-bg-light"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasLightNavbarLabel">
              <CgProfile size={30} />
              {isSignedIn && data && data.name
                ? `Hello, ${data.name.split(" ", 1)}`
                : "Hello, Sign in"}
            </h5>
            <button
              type="button"
              className="btn-close text-reset btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <h5>Trending</h5>
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Best Sellers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  New Releases
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Movers and Shakers
                </a>
              </li>
            </ul>
            <hr />
            <h5>Digital Content and Devices</h5>
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Echo & Alexa
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Fire Tv
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Amazon Prime Video
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Amazon Prime Music
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LowerNavbar;
