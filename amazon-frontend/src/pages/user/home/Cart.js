import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Cart({ updateCartCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [stripe, setStripe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stripePromise = window.Stripe(
      "pk_test_51Nqw75SCRj0uEtF7rl9emM4L6WRrn0RXldeHBGzbTxvJkBbpQEBbqpW75saFT0w3MMk5sO72j9OFI2gge8xLC62S00KpXdE8WB"
    );
    setStripe(stripePromise);

    const token = localStorage.getItem("token");
    if (token) {
      fetchCartData(token);
    }
  }, []);

  const fetchCartData = async (token) => {
    try {
      const apiUrl = "http://localhost:5000/api/cart";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:5000/api/remove-from-cart/${productId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchCartData(token);
        updateCartCount();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const handleBuyNow = async (productId, quantity, productPrice) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `http://localhost:5000/api/create-checkout-session`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const sessionData = await response.json();
        const stripePromise = await stripe;
        const { error } = await stripePromise.redirectToCheckout({
          sessionId: sessionData.sessionId,
        });

        if (error) {
          console.error("Error redirecting to checkout:", error);
        } else {
          navigate("/product/order", {
            state: {
              totalPrice: productPrice * quantity,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error starting the checkout process:", error);
    }
  };

  return (
    <Container style={{ marginTop: "60px" }}>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <Card key={item._id} className="mb-3">
          <Row>
            <Col md={4}>
              <Card.Img src={item.product.images} alt={item.product.title} />
            </Col>
            <Col md={8}>
              <Card.Body>
                <Card.Title>{item.product.title}</Card.Title>
                <Card.Text>Price: ${item.product.discountedPrice}</Card.Text>
                <Card.Text>Quantity: {item.quantity}</Card.Text>
                <Card.Text>
                  Total: ${item.quantity * item.product.discountedPrice}
                </Card.Text>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() =>
                    handleBuyNow(
                      item.product._id,
                      item.quantity,
                      item.product.discountedPrice
                    )
                  }
                >
                  Buy Now
                </Button>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove from Cart
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}
    </Container>
  );
}

export default Cart;
