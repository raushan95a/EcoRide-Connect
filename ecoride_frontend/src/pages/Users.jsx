import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { getAllUsers, registerUser } from '../api/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    age: '',
    contact: '',
    membership_type: 'Regular',
    preferred_travel_mode: 'Solo'
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
      setFormData({ user_id: '', name: '', age: '', contact: '', membership_type: 'Regular', preferred_travel_mode: 'Solo' });
      fetchUsers();
    } catch (e) {
      alert('Error registering user');
    }
  };

  const columns = [
    { key: 'user_id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'membership_type', label: 'Membership' },
    { key: 'preferred_travel_mode', label: 'Travel Mode' },
    { key: 'status_badge', label: 'Status' },
  ];

  const processedData = users.map(u => ({
    ...u,
    status_badge: <Badge label={u.tags ? u.tags[0] : 'Regular'} type={u.eco_friendly ? 'eco' : 'info'} />
  }));

  return (
    <div className="grid-cols-2">
      <div className="card">
        <h2>Register User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID</label>
            <input name="user_id" value={formData.user_id} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input name="contact" value={formData.contact} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Membership</label>
            <select name="membership_type" value={formData.membership_type} onChange={handleInputChange}>
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="form-group">
            <label>Travel Mode</label>
            <select name="preferred_travel_mode" value={formData.preferred_travel_mode} onChange={handleInputChange}>
              <option value="Solo">Solo</option>
              <option value="Carpool">Carpool</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
      <div>
        <h2>All Users</h2>
        <DataTable columns={columns} data={processedData} />
      </div>
    </div>
  );
};

export default Users;
