import React, { useState } from 'react';
import { adminService } from '../../services/adminService'; // Correct named import

const AdminRegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Registration attempt with:', { 
        email,
        adminSecret: adminSecret ? '*****' : 'MISSING',
        apiEndpoint: adminService.registerAdmin.toString() 
      });
      
      const result = await adminService.registerAdmin(email, password, adminSecret);
      console.log('Registration success:', result);
      setMessage('Admin registration successful!');
    } catch (error) {
      console.error('Registration error details:', {
        response: error.response,
        message: error.message,
        stack: error.stack
      });
      setMessage(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  return (
    <div className="admin-registration">
      <h2>Register New Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Secret Key"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          required
        />
        <button type="submit">Register Admin</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminRegistrationForm;