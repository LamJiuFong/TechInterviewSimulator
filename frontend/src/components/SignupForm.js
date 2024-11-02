import './component-styles/SignupForm.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const SignupForm = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await onSignup({ username, email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='signup-form'>
      <h2 className='signup-form-header'>Signup</h2>
      <div>
        <TextField 
          required
          id='username'
          label='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin='normal'
        />
      </div>
      <div>
        <TextField 
          required
          id='email'
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin='normal'
        />
      </div>
      <div>
        <TextField 
          required
          id='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin='normal'
        />
      </div>
      <div>
        <TextField 
          required
          id='confirmPassword'
          label='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin='normal'
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
