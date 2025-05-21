// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <div className="page-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contact-item">📧<span>contact@asyncaccess.com</span></div>
          <div className="contact-item">📱<span>+1 (555) 123-4567</span></div>
          <div className="contact-item">🏢<span>123 Event Ave, City</span></div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="contact-item">📋<span>About Us</span></div>
          <div className="contact-item">📝<span>Terms of Service</span></div>
          <div className="contact-item">🔒<span>Privacy Policy</span></div>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="contact-item">📱<span>Facebook</span></div>
          <div className="contact-item">📱<span>Twitter</span></div>
          <div className="contact-item">📱<span>Instagram</span></div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 AsyncAccess. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;