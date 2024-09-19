// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../api/authApi'; // Import API function

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password); // Call the login API
      const { accessToken, data } = response;
      
      // Save token to localStorage or state
      localStorage.setItem('token', accessToken);
      
      setSuccessMessage('Login successful! Welcome ' + data.name);
      setError(''); // Clear any errors
    } catch (err) {
      setError(err.message || 'Login failed');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
