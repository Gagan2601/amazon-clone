import React from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

function Orders() {
  return (
    <Link to="/user/orders" style={{ color: "white" }}>
      <div className="h-orders">
        <div className="h-orders_hint">Returns</div>
        <div className="h-orders_title">& Orders</div>
      </div>
    </Link>
  );
}

export default Orders;
