import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/index.css";
import React from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ padding: '1rem 3rem', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="nav-brand">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1E293B', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-color)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold' }}>
            E
          </div>
          EcoRide
        </NavLink>
      </div>
      <ul className="nav-links" style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {token ? (
          <>
            {role === "admin" && (
              <>
                <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                <li><NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>Users</NavLink></li>
                <li><NavLink to="/drivers" className={({ isActive }) => isActive ? "active" : ""}>Drivers</NavLink></li>
                <li><NavLink to="/carpool" className={({ isActive }) => isActive ? "active" : ""}>Carpool</NavLink></li>
                <li><NavLink to="/sustainability" className={({ isActive }) => isActive ? "active" : ""}>Sustainability</NavLink></li>
                <li><NavLink to="/rewards" className={({ isActive }) => isActive ? "active" : ""}>Rewards</NavLink></li>
                <li><NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>Analytics</NavLink></li>
                <li><NavLink to="/rides" className={({ isActive }) => isActive ? "active" : ""}>Rides</NavLink></li>
              </>
            )}
            {role !== "admin" && (
              <>
                <li><NavLink to="/my-rides" className={({ isActive }) => isActive ? "active" : ""}>My Rides</NavLink></li>
                <li><NavLink to="/book-ride" className={({ isActive }) => isActive ? "active" : ""}>Book Ride</NavLink></li>
              </>
            )}
            <li><NavLink to="/routes" className={({ isActive }) => isActive ? "active" : ""}>Routes</NavLink></li>
            <li><button onClick={handleLogout} style={{ background: 'var(--danger-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink></li>
            <li><NavLink to="/signup" className={({ isActive }) => isActive ? "active" : ""}>Signup</NavLink></li>
            <li><NavLink to="/admin/login" className={({ isActive }) => isActive ? "active" : ""}>Admin</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
