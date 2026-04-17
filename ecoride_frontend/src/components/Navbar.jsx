import { NavLink } from "react-router-dom";
import "../styles/index.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">EcoRide</NavLink>
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
