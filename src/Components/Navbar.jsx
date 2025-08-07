import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="navbar-title">Expense Tracker</h1>
      </div>

      {user && (
        <ul className="nav-links">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/expenses">Expenses</Link>
          </li>
          <li>
            <Link to="/loans">Loans</Link>
          </li>

          <li>
            <Link to="/transferMoney">Money Transfer</Link>
          </li>

          <li>
            <Link to="/emicalculator">Emi Calculator</Link>
          </li>

          <li>
            <Link to="/reports">Reports</Link>
          </li>
        </ul>
      )}

      {user && (
        <div className="welcome">
          <span>Welcome, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
