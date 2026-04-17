import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getCarpoolGroups } from '../api/api';

const Carpool = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getCarpoolGroups();
        if (typeof res.data === 'object' && !Array.isArray(res.data)) {
          // Flatten into array format
          const formatted = Object.keys(res.data).map(route => ({
             route: route,
             users: res.data[route].map(u => u.user_id).join(', ')
          }));
          setGroups(formatted);
        } else {
          setGroups(res.data);
        }
      } catch (error) {
        console.error('Error fetching carpool groups', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const columns = [
    { key: 'route', label: 'Route' },
    { key: 'user_ids_display', label: 'Users Matched' },
    { key: 'original_fare', label: 'Original Fare' },
    { key: 'reduced_fare_per_user', label: 'Reduced Fare' },
    { key: 'emission_saved_kg', label: 'Emissions Saved (kg)' }
  ];

  if (loading) return <div className="page-container">Loading carpools...</div>;

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Carpool Matching</h2>
        <p className="subtitle">Discover grouped riders actively commuting on the same routes.</p>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Matched Commuters</h3>
        <DataTable columns={columns} data={groups.map(g => ({
           ...g,
           user_ids_display: Array.isArray(g.user_ids) ? g.user_ids.join(', ') : g.user_ids
        }))} />
      </div>
    </div>
  );
};

export default Carpool;