import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { updateUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

const AccountSettingsForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userId = user.id; // Get userId from user object
      await updateUser(userId, { username, email, password });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
      <h2>Update Account Settings</h2>
      <div>
        <TextField
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
          id='email'
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin='normal'
        />
      </div>
      <div style={{ position: 'relative' }}>
        <TextField
          id='password'
          label='New Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin='normal'
          type={showPassword ? 'text' : 'password'}
        />
        {showPassword
          ? <Eye className="eye-icon" onClick={() => setShowPassword(false)} size={20} style={{ position: 'absolute', right: 8, top: '30%' }} />
          : <EyeOff className="eye-icon" onClick={() => setShowPassword(true)} size={20} style={{ position: 'absolute', right: 8, top: '30%' }} />
        }
      </div>
      <div style={{ position: 'relative' }}>
        <TextField
          id='confirmPassword'
          label='Confirm New Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin='normal'
          type={showConfirmPassword ? 'text' : 'password'}
        />
        {showConfirmPassword
          ? <Eye className="eye-icon" onClick={() => setShowConfirmPassword(false)} size={20} style={{ position: 'absolute', right: 8, top: '30%' }} />
          : <EyeOff className="eye-icon" onClick={() => setShowConfirmPassword(true)} size={20} style={{ position: 'absolute', right: 8, top: '30%' }} />
        }
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
        Update Settings
      </Button>
      <Button onClick={() => navigate("/home")} color="secondary" fullWidth style={{ marginTop: '8px' }}>
        Cancel
      </Button>
    </form>
  );
};

export default AccountSettingsForm;
