import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "./AuthForm.css";

const Signup = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
