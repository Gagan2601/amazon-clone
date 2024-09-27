import React from "react";
import Icon from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";
import "./Language.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Popover right</Popover.Header>
    <Popover.Body>
      And here's some <strong>amazing</strong> content. It's very engaging.
      right?
    </Popover.Body>
  </Popover>
);

function LanguageDropdown() {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="bottom"
      overlay={popover}
    >
      <div className="language">
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/color/24/india.png"
          alt="india"
        />
        <div className="language_title">
          EN
          <Icon className="language_arrow" path={mdiMenuDown} size={0.8} />
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default LanguageDropdown;
