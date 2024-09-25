import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

function SellerSaveAddress({ onsaveAddress }) {
  let navigate = useNavigate();
  const [address, setAddress] = useState({
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const requestBody = {
      address: address,
    };
    fetch("http://localhost:5000/api/seller/save-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        onsaveAddress(data.address);
        navigate("/seller");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Container>
      <h2>Save Address</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="addressline1">
          <Form.Label>Address Line 1:</Form.Label>
          <Form.Control
            type="text"
            name="addressline1"
            value={address.addressline1}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="addressline2">
          <Form.Label>Address Line 2:</Form.Label>
          <Form.Control
            type="text"
            name="addressline2"
            value={address.addressline2}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={address.city}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="state">
          <Form.Label>State:</Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={address.state}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country:</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={address.country}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code:</Form.Label>
          <Form.Control
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Address
        </Button>
      </Form>
    </Container>
  );
}

export default SellerSaveAddress;
