import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>EcoRide Connect</h1>
        <p>Sustainable, smart, and efficient transit solutions for a greener tomorrow.</p>
        <Link to="/dashboard" className="btn btn-primary landing-btn">Enter Dashboard</Link>
      </header>
      <section className="landing-features">
        <div className="feature-card">
          <h3>Carpooling</h3>
          <p>Share rides and reduce your carbon footprint while saving on travel costs.</p>
        </div>
        <div className="feature-card">
          <h3>Analytics</h3>
          <p>Deep dive into route demand and user behaviors for smarter planning.</p>
        </div>
        <div className="feature-card">
          <h3>Sustainability</h3>
          <p>Track CO2 emissions and promote eco-friendly travel alternatives.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;