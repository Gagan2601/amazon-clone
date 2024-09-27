import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

function UpdateProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { productId } = useParams();
  const { product } = location.state;
  const [productTitle, setProductTitle] = useState(product.title);
  const [productOriginalPrice, setProductOriginalPrice] = useState(
    product.originalPrice
  );
  const [productDiscountedPrice, setProductDiscountedPrice] = useState(
    product.discountedPrice
  );
  const [productDescription, setProductDescription] = useState(
    product.description
  );
  const [productImages, setProductImages] = useState(product.images);
  const [productQuantity, setProductQuantity] = useState(product.quantity);
  const [productCategory, setProductCategory] = useState(product.category);
  const [error, setError] = useState("");

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/update-product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: productTitle,
        description: productDescription,
        originalPrice: productOriginalPrice,
        discountedPrice: productDiscountedPrice,
        images: productImages,
        quantity: productQuantity,
        category: productCategory,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product updated:", data);
        navigate("/seller/products");
      })
      .catch((error) => {
        setError("Error updating product: " + error.message);
      });
  };

  return (
    <Container>
      <h2>Update Product</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleUpdateProduct}>
        <Form.Group controlId="product-title">
          <Form.Label>Product Title</Form.Label>
          <Form.Control
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="product-description">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="product-original-price">
          <Form.Label>Product Original Price</Form.Label>
          <Form.Control
            type="text"
            value={productOriginalPrice}
            onChange={(e) => setProductOriginalPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="product-discounted-price">
          <Form.Label>Product Discounted Price</Form.Label>
          <Form.Control
            type="text"
            value={productDiscountedPrice}
            onChange={(e) => setProductDiscountedPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="product-images">
          <Form.Label>Product Images</Form.Label>
          <Form.Control
            type="url"
            value={productImages}
            onChange={(e) =>
              setProductImages([...productImages, e.target.value])
            }
          />
        </Form.Group>

        <Form.Group controlId="product-quantity">
          <Form.Label>Product Quantity</Form.Label>
          <Form.Control
            type="number"
            value={productQuantity}
            min="1"
            max="100"
            onChange={(e) => setProductQuantity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="product-category">
          <Form.Label>Product Category</Form.Label>
          <Form.Control
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Product
        </Button>
      </Form>
    </Container>
  );
}

export default UpdateProduct;
