import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = `http://localhost:5000/api/orders/me`;
        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.data);
        } else {
          console.error("Error fetching orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token, orders]);

  const cancelOrder = async (orderId) => {
    try {
      const apiUrl = `http://localhost:5000/api/cancel-order/${orderId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Order canceled successfully");
      } else {
        console.error("Error canceling order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const viewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Container className="orders-container" style={{ marginTop: "60px" }}>
      <h1>My Orders</h1>
      <Row>
        {orders.map((order) => (
          <Col key={order._id} md={6}>
            <Card>
              <Card.Body>
                <h5>
                  Order Date: {new Date(order.orderDate).toLocaleString()}
                </h5>
                <p>Status: {order.status}</p>
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Address: {order.shippingAddress}</p>
                <Button
                  variant="info"
                  onClick={() => viewProduct(order.products[0].product)}
                >
                  View Product
                </Button>
                <Button variant="danger" onClick={() => cancelOrder(order._id)}>
                  Cancel Order
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MyOrders;
