import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }
      // Successful signup, go to login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: "0.5rem" }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "0.5rem" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", background: "#4caf50", color: "#fff", border: "none" }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;