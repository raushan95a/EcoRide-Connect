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
          analytics: a.data.report,
          users: u.data.data || [],
          routes: r.data.data || [],
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Analytics</h2>
      {data.analytics && (
        <div className="card">
          <h3>Analytics Report</h3>
          <p>Total Rides: {data.analytics.total_rides_processed}</p>
          <p>Avg Distance: {data.analytics.average_distance_km} km</p>
          <p>Eco-friendly Rides: {data.analytics.eco_friendly_rides_count}</p>
          <p>Recursive Distance: {data.rec_dist} km</p>
          <p>Recursive Emissions: {data.rec_emis} kg</p>
        </div>
      )}
    </div>
  );
};
export default Analytics;