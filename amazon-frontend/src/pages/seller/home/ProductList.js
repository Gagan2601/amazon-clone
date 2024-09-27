import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Alert } from "react-bootstrap";

function ProductList() {
  const token = localStorage.getItem("token");
  const [sellerProducts, setSellerProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/seller-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSellerProducts(data.data);
      })
      .catch((error) => {
        setError("Error fetching seller's products: " + error.message);
      });
  }, [token]);

  const handleUpdateProduct = (product) => {
    navigate(`/seller/update-product/${product._id}`, { state: { product } });
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:5000/api/delete-product/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setSellerProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      })
      .catch((error) => {
        setError("Error deleting product: " + error.message);
      });
  };

  return (
    <Container>
      <h2>Your Products</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {sellerProducts.map((product) => (
          <ListGroup.Item key={product._id}>
            <Card>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>Description: {product.description}</Card.Text>
                <Card.Text>Price: ${product.discountedPrice}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateProduct(product)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default ProductList;
