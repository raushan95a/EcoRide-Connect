// src/pages/BookRide.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const ROUTES = [
  { id: 1, label: "SRM to Vijayawada", source: "SRM", destination: "Vijayawada", distance: 18.2 },
  { id: 2, label: "Nellore to Guntur", source: "Nellore", destination: "Guntur", distance: 32.4 },
  { id: 3, label: "Tenali to SRM", source: "Tenali", destination: "SRM", distance: 8.85 }
];

const BookRide = () => {
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");
  const userId =
    !storedUserId || storedUserId === "undefined" || storedUserId === "null"
      ? ""
      : storedUserId;

  const [formData, setFormData] = useState({
    route_id: '',
    source_location: '',
    destination_location: '',
    distance_km: '',
    ride_type: 'Solo',
    payment_mode: 'Cash',
    num_passengers: 1
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'route_id') {
      const selectedRoute = ROUTES.find(r => r.id === parseInt(value, 10));
      if (selectedRoute) {
        setFormData(prev => ({
          ...prev,
          route_id: value,
          source_location: selectedRoute.source,
          destination_location: selectedRoute.destination,
          distance_km: selectedRoute.distance
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          route_id: '',
          source_location: '',
          destination_location: '',
          distance_km: ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!userId) {
      setError('Your session is invalid. Please login again.');
      return;
    }

    if (!formData.route_id) {
      setError('Please select a route.');
      return;
    }

    const rideId = `R${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const payload = {
      ride_id: rideId,
      user_id: userId,
      driver_id: "D01", // Default hardcoded driver
      source_location: formData.source_location,
      destination_location: formData.destination_location,
      distance_km: parseFloat(formData.distance_km),
      ride_type: formData.ride_type,
      payment_mode: formData.payment_mode,
      num_passengers: parseInt(formData.num_passengers, 10)
    };

    try {
      const response = await fetch('http://localhost:8000/rides/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to book ride');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="header-container" style={{ textAlign: 'center' }}>
        <h2>Book a Ride</h2>
        <p className="subtitle">Enter your ride details below.</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>Ride booked successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Route</label>
          <select
            name="route_id"
            value={formData.route_id}
            onChange={handleChange}
            required
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            <option value="">-- Choose a Route --</option>
            {ROUTES.map(route => (
              <option key={route.id} value={route.id}>
                {route.label} (Distance: {route.distance} km)
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Ride Type</label>
            <select
              name="ride_type"
              value={formData.ride_type}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="Solo">Solo</option>
              <option value="Carpool">Carpool</option>
            </select>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Mode</label>
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Number of Passengers</label>
          <input
            type="number"
            name="num_passengers"
            value={formData.num_passengers}
            onChange={handleChange}
            required
            min="1"
            max="8"
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '0.75rem', 
            background: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Book Ride
        </button>
      </form>
    </div>
  );
};

export default BookRide;