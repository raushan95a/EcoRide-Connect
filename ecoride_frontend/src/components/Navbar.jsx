import { NavLink } from "react-router-dom";
import "../styles/index.css";

const Navbar = () => {
  return (
    <nav style={{ background: "var(--grad-dark)", padding: "1rem" }}>
      <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", color: "white", margin: 0, padding: 0 }}>
        <li><NavLink to="/" style={{ color: "white", textDecoration: "none" }}>🏠 Dashboard</NavLink></li>
        <li><NavLink to="/users" style={{ color: "white", textDecoration: "none" }}>👤 Users</NavLink></li>
        <li><NavLink to="/drivers" style={{ color: "white", textDecoration: "none" }}>🚗 Drivers</NavLink></li>
        <li><NavLink to="/rides" style={{ color: "white", textDecoration: "none" }}>🛣️ Rides</NavLink></li>
        <li><NavLink to="/routes" style={{ color: "white", textDecoration: "none" }}>📍 Routes</NavLink></li>
        <li><NavLink to="/carpool" style={{ color: "white", textDecoration: "none" }}>🤝 Carpool</NavLink></li>
        <li><NavLink to="/sustainability" style={{ color: "white", textDecoration: "none" }}>🌿 Sustainability</NavLink></li>
        <li><NavLink to="/rewards" style={{ color: "white", textDecoration: "none" }}>🎁 Rewards</NavLink></li>
        <li><NavLink to="/analytics" style={{ color: "white", textDecoration: "none" }}>📊 Analytics</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
