import './component-styles/SignupForm.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { createUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react"

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    //Check if email follows email format
    if (!emailRegex.test(email)) {
      setError("Invalid email format. The email should be in the format: user@email.com");
      return;
    }

    try {
      await createUser({ username, email, password });
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.message);
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
      <div className='flex password-container'>
        <TextField 
          required
          id='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin='normal'
          type={`${showPassword ? '' : 'password'}`}
        />
        {showPassword 
        ? <Eye className="eye-icon" onClick={() => setShowPassword(false)} size={20} /> 
        : <EyeOff className="eye-icon" onClick={() => setShowPassword(true)} size={20} /> 
        }    
      </div>
      <div className='flex password-container'>
        <TextField 
          required
          id='confirmPassword'
          label='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin='normal'
          type={`${showConfirmPassword ? '' : 'password'}`}
        />
        {showConfirmPassword 
        ? <Eye className="eye-icon" onClick={() => setShowConfirmPassword(false)} size={20} /> 
        : <EyeOff className="eye-icon" onClick={() => setShowConfirmPassword(true)} size={20} /> 
        }    
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
      <button onClick={() => navigate("/login")}>Already have an account? Sign In</button>
    </form>
  );
};

export default SignupForm;
