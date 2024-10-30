import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <div className="container-footer">
      <p>
        &copy; {new Date().getFullYear()} Casino's Best Customers. All rights
        reserved.
      </p>
    </div>
  );
};

export default Footer;