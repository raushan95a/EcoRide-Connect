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

  if (loading) return <div className="page-container">Loading eco-metrics...</div>;

  const userColumns = [
    { key: 'user_name', label: 'Name' },
    { key: 'eco_friendly_score', label: 'Eco Score' }
  ];

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Sustainability Report</h2>
        <p className="subtitle">Tracking our impact on the environment through efficient commuting.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="subtitle">Total Fuel Consumed</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{report.total_fuel_consumed} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>liters</span></div>
        </div>
        <div className="card">
          <h3 className="subtitle">EV Percentage</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{report.electric_vehicle_percentage}<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>%</span></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Top Eco-Friendly Users</h3>
        <DataTable columns={userColumns} data={report.top_eco_users || []} />
      </div>
    </div>
  );
};

export default Sustainability;