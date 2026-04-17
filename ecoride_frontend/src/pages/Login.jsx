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
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("role", "user");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>User Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "0.5rem" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", background: "#4caf50", color: "#fff", border: "none" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p>
        Are you an admin? <Link to="/admin/login">Admin Login</Link>
      </p>
    </div>
  );
}

export default Login;