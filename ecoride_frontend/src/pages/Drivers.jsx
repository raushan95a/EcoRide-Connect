import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { getAllDrivers, registerDriver } from '../api/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    driver_id: '',
    name: '',
    vehicle_type: 'Sedan',
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
      fetchDrivers();
    } catch (e) {
      alert('Error registering driver');
    }
  };

  const columns = [
    { key: 'driver_id', label: 'Driver ID' },
    { key: 'name', label: 'Name' },
    { key: 'vehicle_type', label: 'Vehicle' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'rating', label: 'Rating' },
    { key: 'status_badge', label: 'Status' }
  ];

  const processedData = drivers.map(d => ({
    ...d,
    status_badge: <Badge label={d.eco_friendly ? "Eco-Friendly" : "Regular"} type={d.eco_friendly ? "eco" : "info"} />
  }));

  return (
    <div className="grid-cols-2">
      <div className="card">
        <h2>Register Driver</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Driver ID</label><input name="driver_id" onChange={handleInputChange} required/></div>
          <div className="form-group"><label>Name</label><input name="name" onChange={handleInputChange} required/></div>
          <div className="form-group"><label>Vehicle Type</label><select name="vehicle_type" onChange={handleInputChange}><option>Sedan</option><option>SUV</option><option>Hatchback</option></select></div>
          <div className="form-group"><label>Fuel Type</label><select name="fuel_type" onChange={handleInputChange}><option>Petrol</option><option>Diesel</option><option>Electric</option></select></div>
          <div className="form-group"><label>Vehicle Number</label><input name="vehicle_number" onChange={handleInputChange} required/></div>
          <div className="form-group"><label>Rating</label><input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} required/></div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
      <div>
        <h2>All Drivers</h2>
        <DataTable columns={columns} data={processedData} />
      </div>
    </div>
  );
};
export default Drivers;