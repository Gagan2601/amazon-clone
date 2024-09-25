import React from "react";
import Icon from "@mdi/react";
import { mdiMapMarkerOutline } from "@mdi/js";
import { Link } from "react-router-dom";
import "./Location.css";

function Location({ isSignedIn, data, saveAddress, address }) {
  const userAddress = data?.address;
  return (
    <Link to="/user/save-address" className="link">
      <div className="location">
        <Icon className="location_pin" path={mdiMapMarkerOutline} size={1} />
        <div className="location_details">
          <div className="location_hint">
            {isSignedIn && data && data.name 
              ? `Deliver to ${data.name.split(" ", 1)}`
              : "Hello"}
          </div>
          <div className="location_title">
          {userAddress
              ? `${userAddress.city} ${userAddress.postalCode}`
              : "Select your address"}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Location;
