import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
// import "./Account.css";

function SellerAccount({ data, setData }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [name, setName] = useState(data.data.name || "");
  const [email, setEmail] = useState(data.data.email || "");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpdateSellerInfo = async () => {
    try {
      const apiUrl = `http://localhost:5000/api/seller/${sellerId}`;
      const updatedSellerData = {
        name,
        email,
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSellerData),
      });

      if (response.ok) {
        console.log("Seller info updated successfully");
        setData({ entity: { ...data.data, name, email } });
      } else {
        const errorData = await response.json();
        console.error("Error updating user info:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("seller_id");
    navigate("/seller/signin");
    window.location.reload();
  };

  return (
    <Container className="account-container">
      <h1>My Account</h1>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateSellerInfo}>
              Update Info
            </Button>
            <Button variant="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SellerAccount;
