import React from "react";
import "./Card.css";
import { Col } from "react-bootstrap";

function Card(props) {
  const { category } = props;
  const renderImg = () => {
    if (category.image.length > 1) {
      return (
        <div className="card-img-container">
          {category.image.slice(0, 4).map((image, index) => (
            <div key={index} className="image-container">
              <img src={image} className="card-img" alt={`Image ${index}`} />
              <p className="image-tag">{category.image_tag[index]}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          <img
            key={category.id}
            src={category.image}
            className="single-img-card-img"
            alt={`Image`}
          />
          {category.image_tag && (
            <p className="image-tag">{category.image_tag[0]}</p>
          )}
        </div>
      );
    }
  };
  return (
    <Col>
      <div className="card-container">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{category.title}</h5>
            {renderImg()}
            <a href="#" className="card-link">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </Col>
  );
}

export default Card;
