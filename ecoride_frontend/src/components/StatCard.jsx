import React from 'react';
import '../styles/index.css';

const StatCard = ({ title, value, unit, color, icon }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `4px solid ${color || 'var(--primary-color)'}` }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem', textAlign: 'center' }}>{title}</h3>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
        {value} {unit && <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>
    </div>
  );
};

export default StatCard;