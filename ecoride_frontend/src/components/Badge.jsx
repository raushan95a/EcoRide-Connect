import React from 'react';
import '../styles/index.css';

const Badge = ({ label, type = "info" }) => {
  let backgroundColor;
  let color;

  switch (type) {
    case 'success':
    case 'eco':
      backgroundColor = 'var(--success-color)';
      color = 'white';
      break;
    case 'danger':
    case 'unreliable':
      backgroundColor = 'var(--danger-color)';
      color = 'white';
      break;
    case 'warning':
    case 'high-demand':
      backgroundColor = 'var(--warning-color)';
      color = 'white';
      break;
    case 'info':
    case 'frequent':
      backgroundColor = 'var(--info-color)';
      color = 'white';
      break;
    default:
      backgroundColor = 'var(--border-color)';
      color = 'var(--text-secondary)';
  }

  return (
    <span className="badge" style={{ backgroundColor, color }}>
      {label}
    </span>
  );
};

export default Badge;
