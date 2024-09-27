import React from 'react';
import BrandLogo from '../../assests/images/amazon-logo.png';
import './Logo.css';

function Logo({country = 'in'}) {
  return (
    <a href="/" className="logo">
      <img className="logo_img" alt="Amazon" src={BrandLogo} />
      {country && <span className="logo_country">.{country}</span>}
    </a>
  )
}

export default Logo