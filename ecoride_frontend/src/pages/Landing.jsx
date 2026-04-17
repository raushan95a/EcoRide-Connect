import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <header className="landing-header" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>EcoRide Connect</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>Sustainable, intelligent, and efficient transit solutions for a greener tomorrow.</p>
        <Link to="/dashboard" className="btn btn-primary landing-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.25rem', borderRadius: '8px', boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)' }}>Access Dashboard</Link>
      </header>
      <section className="landing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', width: '100%', marginTop: '6rem', maxWidth: '1200px' }}>
        <div className="card feature-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>Smart Carpooling</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>Share intelligent rides and reduce your carbon footprint while seamlessly saving on travel costs across matching routes.</p>
        </div>
        <div className="card feature-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>Advanced Analytics</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>Deep dive into route demand, peak times, and user behaviors with comprehensive dashboards for smarter planning.</p>
        </div>
        <div className="card feature-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>Sustainability Tracking</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>Quantitatively track and analyze CO2 emissions. Promote and reward eco-friendly travel alternatives system-wide.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;