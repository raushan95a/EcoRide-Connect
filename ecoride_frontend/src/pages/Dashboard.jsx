import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import { getAnalyticsReport, getSustainabilityReport, getAllUsers, getAllDrivers } from "../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    analytics: null,
    sustainability: null,
    usersCount: 0,
    driversCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, sustainabilityRes, usersRes, driversRes] = await Promise.all([
          getAnalyticsReport(),
          getSustainabilityReport(),
          getAllUsers(),
          getAllDrivers(),
        ]);
        setData({
          analytics: analyticsRes.data,
          sustainability: sustainabilityRes.data,
          usersCount: usersRes.data.length,
          driversCount: driversRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  if (!data.analytics) return <div>Loading Dashboard...</div>;

  const barData = [
    { name: "SRM - Guntur", rides: 8 },
    { name: "SRM - Vijayawada", rides: 6 },
    { name: "Chennai - SRM", rides: 3 },
  ]; // Placeholder for Most Popular Routes

  const pieData = [
    { name: "Solo", value: 300 },
    { name: "Carpool", value: 150 },
  ];
  const pieColors = ["#FF7A18", "#00C9A7"];

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid-cols-2" style={{ gap: "1rem", marginBottom: "2rem" }}>
        <StatCard title="Total Rides" value={data.analytics.total_rides} color="var(--primary-color)" />
        <StatCard title="Average Distance" value={data.analytics.average_distance_km} unit="km" color="var(--accent-color)" />
        <StatCard title="Total CO2 Emitted" value={data.sustainability.total_co2_emitted_kg} unit="kg" color="var(--warning-color)" />
        <StatCard title="Eco-Friendly Rides" value={data.analytics.eco_friendly_rides} color="var(--success-color)" />
        <StatCard title="Cancelled Rides" value={data.analytics.cancelled_rides} color="var(--danger-color)" />
      </div>

      <div className="grid-cols-2">
        <div className="card">
          <h3>Top Routes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rides" fill="var(--primary-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Ride Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
