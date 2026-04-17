import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getPopularRoutes } from '../api/api';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getPopularRoutes();
        // Assume API returns array of objects or an object of { "route": count } that needs transformation
        if (Array.isArray(res.data)) {
           setRoutes(res.data);
        } else {
           // If it's an object of route frequencies
           const transformed = Object.keys(res.data).map(k => ({
             route: k,
             count: res.data[k]
           }));
           setRoutes(transformed);
        }
      } catch (error) {
        console.error('Error fetching routes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const columns = [
    { key: 'route', label: 'Route' },
    { key: 'count', label: 'Ride Count' }
  ];

  if (loading) return <div className="page-container">Loading routes...</div>;

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Popular Routes Analysis</h2>
        <p className="subtitle">Discover our most frequent and in-demand travel routes.</p>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Top Routes Directory</h3>
        <DataTable columns={columns} data={routes} />
      </div>
    </div>
  );
};

export default RoutesPage;