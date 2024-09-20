// src/pages/Home.js
import React, { useContext } from 'react';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Home Page!</h1>
      <LogoutButton />
    </div>
  );
};

export default Home;
