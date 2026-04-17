import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getRewardWinners } from '../api/api';

const Rewards = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await getRewardWinners();
        if (res.data.discount_winners) {
          setWinners(res.data.discount_winners);
        } else {
          setWinners(res.data);
        }
      } catch (error) {
        console.error('Error fetching rewards', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, []);

  const columns = [
    { key: 'user_name', label: 'User Name' },
    { key: 'user_id', label: 'User ID' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Rewards & Discounts</h2>
      <p>Users eligible for sustainability rewards.</p>
      <DataTable columns={columns} data={winners} />
    </div>
  );
};

export default Rewards;