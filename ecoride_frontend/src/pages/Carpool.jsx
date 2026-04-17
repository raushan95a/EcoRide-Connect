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
    { key: 'users', label: 'Users matched' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Carpool Matching</h2>
      <DataTable columns={columns} data={groups} />
    </div>
  );
};

export default Carpool;