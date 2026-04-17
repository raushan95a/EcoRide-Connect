import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getSustainabilityReport } from '../api/api';
import StatCard from '../components/StatCard';

const Sustainability = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getSustainabilityReport();
        setReport(res.data);
      } catch (error) {
        console.error('Error fetching sustainability', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div>Loading...</div>;

  const userColumns = [
    { key: 'user_name', label: 'Name' },
    { key: 'eco_friendly_score', label: 'Score' }
  ];

  return (
    <div>
      <h2>Sustainability Overview</h2>
      <div className="grid-cols-2">
         <StatCard title="Total Fuel Consumed" value={report.total_fuel_consumed} unit="liters" />
         <StatCard title="EV Percentage" value={report.electric_vehicle_percentage} unit="%" />
      </div>
      <h3>Top Eco Users</h3>
      <DataTable columns={userColumns} data={report.top_eco_users || []} />
    </div>
  );
};

export default Sustainability;