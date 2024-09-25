import React from "react";
import Icon from "@mdi/react";
import { mdiCartOutline } from "@mdi/js";
import { Link } from "react-router-dom";

import "./Cart.css";

function Cart({ cartCount }) {
  console.log(cartCount);
  return (
    <Link to="/user/cart" className="h-cart">
      <Icon path={mdiCartOutline} size={1.2} />
      <div className="h-cart_count">{cartCount}</div>
    </Link>
  );
}

export default Cart;
