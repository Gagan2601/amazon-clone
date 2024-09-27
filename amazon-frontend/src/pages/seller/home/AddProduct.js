import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

function AddProduct() {
  const token = localStorage.getItem("token");
  const sellerId = localStorage.getItem("seller_id");
  const [productTitle, setProductTitle] = useState("");
  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productDiscountedPrice, setProductDiscountedPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productCategory, setProductCategory] = useState("");

  const handleAddProduct = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/add-product", {
      method: "POST",
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
        seller: sellerId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added:", data);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  return (
    <Container>
      <h2>Add Product</h2>
      <Form onSubmit={handleAddProduct}>
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
          Add Product
        </Button>
      </Form>
    </Container>
  );
}

export default AddProduct;
