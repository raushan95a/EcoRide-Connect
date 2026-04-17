import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { getAnalyticsReport, getUserSummaryTable, getRouteSummaryTable, getRecursiveTotalDistance, getRecursiveTotalEmissions } from '../api/api';

const Analytics = () => {
  const [data, setData] = useState({ analytics: null, users: [], routes: [], rec_dist: null, rec_emis: null });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [a, u, r, d, e] = await Promise.all([
          getAnalyticsReport(),
          getUserSummaryTable(),
          getRouteSummaryTable(),
          getRecursiveTotalDistance(),
          getRecursiveTotalEmissions()
        ]);
        setData({
          analytics: a.data,
          users: Array.isArray(u.data) ? u.data : (u.data?.data || []),
          routes: Array.isArray(r.data) ? r.data : (r.data?.data || []),
          rec_dist: d.data.total_distance_km,
          rec_emis: e.data.total_emissions_kg
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Analytics Overview</h2>
        <p className="subtitle">Comprehensive insights and system metrics.</p>
      </div>

      {data.analytics && (
        <div className="stat-grid">
          <div className="card">
            <h3 className="subtitle">Total Rides</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.analytics.total_rides}</div>
          </div>
          <div className="card">
            <h3 className="subtitle">Avg Distance</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.analytics.average_distance_km} km</div>
          </div>
          <div className="card">
            <h3 className="subtitle">Eco-friendly Rides</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{data.analytics.eco_friendly_rides}</div>
          </div>
          <div className="card">
            <h3 className="subtitle">Avg Fare</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{data.analytics.average_fare}</div>
          </div>
          <div className="card">
            <h3 className="subtitle">Recursive Distance</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{data.rec_dist} km</div>
          </div>
          <div className="card">
            <h3 className="subtitle">Recursive Emissions</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{data.rec_emis} kg</div>
          </div>
        </div>
      )}

      {data.routes.length > 0 && (
        <div className="card mt-4">
          <h3 style={{ marginBottom: '1rem' }}>Route Summary</h3>
          <DataTable 
             columns={[
               {key: 'route', label: 'Route'}, 
               {key: 'total_rides', label: 'Total Rides'},
               {key: 'avg_fare', label: 'Avg Fare (₹)'},
               {key: 'demand_tag', label: 'Demand'}
             ]} 
             data={data.routes} 
          />
        </div>
      )}
      
      {data.users.length > 0 && (
        <div className="card mt-4" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>User Summary</h3>
          <DataTable 
             columns={[
               {key: 'user_id', label: 'User ID'}, 
               {key: 'total_rides', label: 'Total Rides'},
               {key: 'avg_distance', label: 'Avg Distance (km)'},
               {key: 'total_emission', label: 'Total Emissions (kg)'},
               {key: 'status', label: 'Status'}
             ]} 
             data={data.users} 
          />
        </div>
      )}
    </div>
  );
};
export default Analytics;