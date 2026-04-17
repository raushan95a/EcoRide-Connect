// src/pages/Rides.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import '../styles/index.css';

const Rides = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/rides')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch rides');
        }
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const columns = [
    { label: 'ID', key: 'ride_id' },
    { label: 'Rider ID', key: 'user_id' },
    { label: 'Driver ID', key: 'driver_id' },
    { label: 'Start', key: 'source_location' },
    { label: 'End', key: 'destination_location' },
    { label: 'Distance', key: 'distance_km', render: (val) => `${val} km` },
    { 
      label: 'Status', 
      key: 'ride_status',
      render: (val) => {
        const normalizedVal = val ? val.toLowerCase() : '';
        let bgColor = '#3b82f6'; // default blue
        if (normalizedVal === 'completed') bgColor = '#10b981'; // green
        if (normalizedVal === 'cancelled' || normalizedVal === 'canceled') bgColor = '#ef4444'; // red
        if (normalizedVal === 'ongoing') bgColor = '#f59e0b'; // yellow

        return (
          <button 
            style={{ 
              backgroundColor: bgColor, 
              color: 'white', 
              border: 'none', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.85rem',
              textTransform: 'uppercase'
            }}
          >
            {val || 'UNKNOWN'}
          </button>
        );
      }
    }
  ];

  if (loading) return <div className="page-container">Loading overrides...</div>;
  if (error) return <div className="page-container">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Rides</h2>
        <p className="subtitle">Manage and track all rides.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Rides;
