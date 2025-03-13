import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // Import CSS
import { loginUser } from "../services/api";
import { saveTokens } from "../utils/auth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);
      
      // Store tokens
      saveTokens(data.access, data.refresh);
      
      // Store user data
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);

      // Redirect based on role
      if (data.role === 'System Admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Invalid credentials");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🌿 Welcome to Gardening App</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit" className={`login-button ${loading ? "loading" : ""}`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
