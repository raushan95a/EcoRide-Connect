import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { getAllUsers, registerUser } from '../api/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    user_name: '',
    age: '',
    contact_number: '',
    membership_type: 'Regular',
    preferred_travel_mode: 'Carpool'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
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
      await registerUser(formData);
      alert('User registered successfully');
      setFormData({ user_id: '', user_name: '', age: '', contact_number: '', membership_type: 'Regular', preferred_travel_mode: 'Carpool' });
      fetchUsers();
    } catch (e) {
      alert('Error registering user');
    }
  };

  const columns = [
    { key: 'user_id', label: 'User ID' },
    { key: 'user_name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'membership_type', label: 'Membership' },
    { key: 'preferred_travel_mode', label: 'Travel Mode' },
    { key: 'status_badge', label: 'Status' },
  ];

  const processedData = users.map(u => ({
    ...u,
    status_badge: <Badge label={u.user_status || 'Regular Rank'} type={u.user_status?.includes('Eco') ? 'eco' : 'info'} />
  }));

  return (
    <div className="page-container">
      <div className="header-container">
        <h2>User Management</h2>
        <p className="subtitle">Register new users and view user data.</p>
      </div>
      <div className="grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>User ID</label>
              <input name="user_id" value={formData.user_id} onChange={handleInputChange} placeholder="e.g. U101" required />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="user_name" value={formData.user_name} onChange={handleInputChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 25" required />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input name="contact_number" value={formData.contact_number} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div className="form-group">
              <label>Membership Type</label>
              <select name="membership_type" value={formData.membership_type} onChange={handleInputChange}>
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Travel Mode</label>
              <select name="preferred_travel_mode" value={formData.preferred_travel_mode} onChange={handleInputChange}>
                <option value="Solo">Solo</option>
                <option value="Carpool">Carpool</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register User</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>All Users</h3>
          <DataTable columns={columns} data={processedData} />
        </div>
      </div>
    </div>
  );
};

export default Users;
