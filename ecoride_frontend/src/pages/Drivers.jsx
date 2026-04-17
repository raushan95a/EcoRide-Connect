import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { getAllDrivers, registerDriver } from '../api/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    driver_id: '',
    driver_name: '',
    vehicle_type: 'Car',
    vehicle_number: '',
    fuel_type: 'Petrol',
    rating: 5
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await getAllDrivers();
      setDrivers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDriver({ ...formData, rating: parseFloat(formData.rating) });
      alert('Driver registered successfully');
      setFormData({ driver_id: '', driver_name: '', vehicle_type: 'Car', vehicle_number: '', fuel_type: 'Petrol', rating: 5 });
      fetchDrivers();
    } catch (e) {
      alert('Error registering driver');
    }
  };

  const columns = [
    { key: 'driver_id', label: 'Driver ID' },
    { key: 'driver_name', label: 'Name' },
    { key: 'vehicle_type', label: 'Vehicle' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'rating', label: 'Rating' },
    { key: 'status_badge', label: 'Status' }
  ];

  const processedData = drivers.map(d => ({
    ...d,
    status_badge: <Badge label={d.driver_status || "Regular"} type={d.driver_status?.toLowerCase().includes('eco') ? "eco" : "info"} />
  }));

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>Driver Management</h2>
        <p className="subtitle">Register new drivers and manage existing ones.</p>
      </div>
      <div className="grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register Driver</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Driver ID</label>
              <input name="driver_id" value={formData.driver_id} onChange={handleInputChange} placeholder="e.g. D101" required />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input name="driver_name" value={formData.driver_name} onChange={handleInputChange} placeholder="Full Name" required />
            </div>
            <div className="form-group">
              <label>Vehicle Type</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={handleInputChange}>
                <option>Car</option>
                <option>Bike</option>
                <option>Electric</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vehicle Number</label>
              <input name="vehicle_number" value={formData.vehicle_number} onChange={handleInputChange} placeholder="e.g. AP09XX1234" required />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} min="1" max="5" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register Driver</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>All Drivers</h3>
          <DataTable columns={columns} data={processedData} />
        </div>
      </div>
    </div>
  );
};
export default Drivers;