import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/faq">Read FAQ</Link>
        <Link to="/help">Get Help</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/signup-store">Signup for Adding Your Store</Link>
        <Link to="/signup-delivery">Signup for Delivery</Link>
      </div>
    </footer>
  );
};

export default Footer;