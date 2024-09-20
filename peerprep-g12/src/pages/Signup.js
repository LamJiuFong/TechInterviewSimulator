// src/pages/Signup.js
import React, { useState, useContext } from 'react';
import { signup } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(email, password);
      login(response.token); // Update context with token
      navigate('/');
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
