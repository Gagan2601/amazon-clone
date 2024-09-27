import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import Notification from "./Notification";

function SellerHomePage({ data }) {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  console.log(data);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/seller/notifications",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const productData = await response.json();
          console.log(productData);
          setNotifications(productData.data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
    fetchNotifications();
  }, []);
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h2>Welcome, Seller!</h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Add Product</Card.Title>
              <Card.Text>
                Click here to add a new product to your store.
              </Card.Text>
              <Link to="/seller/add-product">
                <Button variant="primary">Add Product</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Get Products</Card.Title>
              <Card.Text>View and manage your existing products.</Card.Text>
              <Link to="/seller/products">
                <Button variant="primary">Get Products</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Account</Card.Title>
              <Card.Text>Manage your seller account settings.</Card.Text>
              <Link to={`/seller/account/${data.data._id}`}>
                <Button variant="primary">Account</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Save Address</Card.Title>
              <Card.Text>Update your shipping address information.</Card.Text>
              <Link to={`/seller/save-address`}>
                <Button variant="primary">Save Address</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              <Card.Text>Check who ordered your products.</Card.Text>
              <Link to="/seller/orders">
                <Button variant="primary">Seller Orders</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Notification notifications={notifications} />
        </Col>
      </Row>
    </Container>
  );
}

export default SellerHomePage;
