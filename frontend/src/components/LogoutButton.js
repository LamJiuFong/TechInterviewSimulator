import React from 'react';
import './component-styles/LogoutButton.css';
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Call the logout function to clear user data
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;
