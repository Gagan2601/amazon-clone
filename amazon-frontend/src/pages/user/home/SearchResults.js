import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./SearchResults.css";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("searchTerm");
  const category = searchParams.get("category");
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (searchTerm !== undefined) {
      let apiUrl = `http://localhost:5000/api/products/search/${searchTerm}`;
      if (category && category !== "All Categories") {
        apiUrl += `?category=${encodeURIComponent(category)}`;
      }
      console.log(apiUrl);
      fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data.data);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [searchTerm, category, token]);

  const handleViewDetails = (product) => {
    navigate(`/products/${product._id}`, { state: { product } });
  };

  return (
    <Container style={{ marginTop: "60px" }}>
      {searchTerm ? (
        <>
          <h1>Search Results for "{searchTerm}"</h1>
          <Row>
            {products.map((product, index) => (
              <Col key={index} md={4}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={product.images}
                    alt="product images"
                  />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Button
                      onClick={() => {
                        handleViewDetails(product);
                      }}
                      variant="primary"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <p>Please enter a search term.</p>
      )}
    </Container>
  );
}

export default SearchResults;
