import { NavLink } from "react-router-dom";
import "../styles/index.css";

const Navbar = () => {
  return (
    <nav className="navbar" style={{ padding: '1rem 3rem', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      <div className="nav-brand">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1E293B' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-color)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 'bold' }}>
            E
          </div>
          EcoRide
        </NavLink>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
        <li><NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>Users</NavLink></li>
        <li><NavLink to="/drivers" className={({ isActive }) => isActive ? "active" : ""}>Drivers</NavLink></li>
        <li><NavLink to="/rides" className={({ isActive }) => isActive ? "active" : ""}>Rides</NavLink></li>
        <li><NavLink to="/routes" className={({ isActive }) => isActive ? "active" : ""}>Routes</NavLink></li>
        <li><NavLink to="/carpool" className={({ isActive }) => isActive ? "active" : ""}>Carpool</NavLink></li>
        <li><NavLink to="/sustainability" className={({ isActive }) => isActive ? "active" : ""}>Sustainability</NavLink></li>
        <li><NavLink to="/rewards" className={({ isActive }) => isActive ? "active" : ""}>Rewards</NavLink></li>
        <li><NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>Analytics</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
