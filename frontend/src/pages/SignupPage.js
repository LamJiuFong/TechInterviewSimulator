// src/pages/SignupPage.js
import './page-styles/SignupPage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/userApi'; // Your API function
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (userData) => {
    await createUser(userData);
    navigate('/login'); // Redirect to login after successful signup
  };

  return (
    <div className="signup-container">
      <SignupForm onSignup={handleSignup} />
    </div>
  );
};

export default SignupPage;
