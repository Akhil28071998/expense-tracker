import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Navbar from "../Components/Navbar";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { user, login, signup } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    isSignup
      ? signup(formData.username, formData.password)
      : login(formData.username, formData.password);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="main-content">
        {user ? (
          <Outlet />
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
            <p onClick={() => setIsSignup(!isSignup)} className="toggle-auth">
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </form>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
