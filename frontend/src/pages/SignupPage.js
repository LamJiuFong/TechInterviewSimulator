// src/pages/SignupPage.js
import './page-styles/SignupPage.css';
import React from 'react';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {

  return (
    <div className="signup-container">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
