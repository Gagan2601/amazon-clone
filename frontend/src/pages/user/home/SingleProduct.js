import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Carousel,
  Form,
  Modal,
} from "react-bootstrap";
import Rating from "@mui/material/Rating";

function SingleProduct({ updateCartCount }) {
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleShowReviewModal = () => {
    setShowReviewModal(true);
  };

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    if (productId) {
      fetchProductDetails();
    }
    async function fetchReviews() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    if (product) {
      fetchReviews();
    }
  }, [productId, product, token, reviews]);

  const handleRatingChange = (event, newValue) => {
    setUserReview({ ...userReview, rating: newValue });
  };

  const handleCommentChange = (event) => {
    setUserReview({ ...userReview, comment: event.target.value });
  };

  const handleSubmitReview = async () => {
    try {
      const { rating, comment } = userReview;
      const reviewData = {
        id: productId,
        rating,
        comment,
      };

      const response = await fetch("http://localhost:5000/api/review-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();

      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);

      handleCloseReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });
      if (!response) {
        throw new Error("Failed to add the product to the cart");
      }
      updateCartCount();
      setAddedToCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <Container style={{ marginTop: "60px" }}>
      <h1>Product Details</h1>
      <Row>
        <Col md={6}>
          <Carousel>
            {product.images.map((image, index) => (
              <Carousel.Item key={index}>
                <Image src={image} alt={`Product Image ${index + 1}`} fluid />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6}>
          <h1>{product.title}</h1>
          <p>Description: {product.description}</p>
          <h4>Price: ${product.discountedPrice}</h4>
          <s>
            <h6>Original Price: ${product.originalPrice}</h6>
          </s>
          <h6>Category: {product.category}</h6>
          <h6>Quantity: {product.quantity} available</h6>

          <Button
            variant={addedToCart ? "success" : "primary"}
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? "Added to Cart" : "Add to Cart"}
          </Button>

          <hr />

          <h4>Product Reviews</h4>
          <ListGroup>
            {reviews.map((review) => (
              <ListGroupItem key={review._id}>
                <strong>User:</strong> {review.userId}
                <br />
                <strong>Rating:</strong>{" "}
                <Rating name="read-only" value={review.rating} readOnly />
                <br />
                <strong>Comment:</strong> {review.comment}
              </ListGroupItem>
            ))}
          </ListGroup>
          <Button variant="primary" onClick={handleShowReviewModal}>
            Write a Review
          </Button>
        </Col>
      </Row>
      <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Your Rating:</Form.Label>
              <Rating
                name="user-rating"
                value={userReview.rating}
                onChange={handleRatingChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Your Comment:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={userReview.comment}
                onChange={handleCommentChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReviewModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SingleProduct;
