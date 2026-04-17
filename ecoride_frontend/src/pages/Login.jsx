import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }
      if (!data.token || !data.user_id) {
        throw new Error("Invalid login response from server");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("role", "user");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to plan your next eco-friendly ride.</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="auth-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="auth-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-button primary">
            Secure Login
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up for free</Link></p>
          <div className="auth-divider"></div>
          <p>Staff member? <Link to="/admin/login">Admin Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;