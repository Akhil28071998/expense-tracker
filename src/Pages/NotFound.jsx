import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! Page not found.</p>
      <Link to="/" className="notfound-button">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
