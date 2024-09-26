import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const totalPrice = queryParams.get("price");
  const shippingAddress = queryParams.get("address");

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "http://localhost:5000/api/order";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalPrice,
        }),
      });

      if (response.ok) {
        setOrderPlaced(true);
        navigate("/user/cart");
      }
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  return (
    <Container>
      <h2>Your Order Summary</h2>
      <p>Total Price: ${totalPrice}</p>
      <p>Shipping Address: {shippingAddress}</p>
      <Button variant="primary" onClick={handlePlaceOrder}>
        Place Order
      </Button>
      {orderPlaced && <p>Order placed successfully!</p>}
    </Container>
  );
}

export default OrderPage;
