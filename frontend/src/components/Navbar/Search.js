import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

import "./Search.css";

const categories = [
  "All Categories",
  "Alexa Skills",
  "Amazon Devices",
  "Amazon Fashion",
  "Amazon Fresh",
  "Amazon Pharmacy",
  "Appliances",
  "Apps & Games",
  "Audible Audiobooks",
  "Baby",
  "Beauty",
  "Books",
  "Car & Motorbike",
  "Clothing & Accessories",
  "Collectibles",
  "Computers & Accessories",
  "Electronics",
  "Furniture",
  "Garden & Outdoors",
  "Gift Cards",
  "Grocery & Gourmet Foods",
  "Health & Personal Care",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Jewellery",
  "Kindle Store",
  "Luggage & Bags",
  "Luxury Beauty",
  "Movies & TV Shows",
  "Music",
  "Musical Instruments",
  "Office Products",
  "Pet Supplies",
  "Prime Video",
  "Shoes & Handbags",
  "Software",
  "Sports, Fitness & Outdoors",
  "Tools & Home Improvement",
  "Toys & Games",
  "Under ₹500",
  "Video Games",
  "Watches",
];

function Search() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(
        `/search-results?searchTerm=${encodeURIComponent(
          searchTerm
        )}&category=${encodeURIComponent(category)}`
      );
    }
  };
  return (
    <div className="search">
      <select
        className="search_select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <input
        className="search_input"
        type="text"
        placeholder="Search Amazon.in"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search_button" onClick={handleSearch}>
        <Icon path={mdiMagnify} size={1.4} />
      </button>
    </div>
  );
}

export default Search;
