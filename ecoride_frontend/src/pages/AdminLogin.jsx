import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="auth-container" style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "0.5rem" }} />
        <input type="password" placeholder="Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", background: "#2196f3", color: "#fff", border: "none" }}>
          Login as Admin
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;