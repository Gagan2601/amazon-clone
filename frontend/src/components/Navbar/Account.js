import React from "react";
import Icon from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";
import { Link } from "react-router-dom";

import "./Account.css";

function Account({ isSignedIn, data }) {
  return (
    <Link
      to={isSignedIn ? `user/account/${data._id}` : "/user/signin"}
      className="link"
    >
      <div className="account">
        <div className="account_hint">
          {isSignedIn && data && data.name
            ? `Hello, ${data.name.split(" ", 1)}`
            : "Hello, Sign in"}
        </div>
        <div className="account_title">
          Accounts & Lists
          <Icon className="account_arrow" path={mdiMenuDown} size={0.8} />
        </div>
      </div>
    </Link>
  );
}

export default Account;
