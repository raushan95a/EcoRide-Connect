// src/pages/Rides.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
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
    { header: 'ID', accessor: 'id' },
    { header: 'Rider ID', accessor: 'rider_id' },
    { header: 'Driver ID', accessor: 'driver_id' },
    { header: 'Start Location', accessor: 'start_location' },
    { header: 'End Location', accessor: 'end_location' },
    { header: 'Distance (km)', accessor: 'distance_km' },
    { header: 'Status', accessor: 'status' }
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
