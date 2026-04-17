import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Admin login failed");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'inline-flex', padding: '12px', background: '#0f172a', borderRadius: '12px', marginBottom: '1rem', color: 'white' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2>Admin Portal</h2>
        <p className="auth-subtitle">Restricted access. Authorized personnel only.</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleAdminLogin} className="auth-form">
          <div className="input-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              className="auth-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Master Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="auth-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-button admin-btn">
            Authenticate
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-divider"></div>
          <p><Link to="/login">Return to User Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;