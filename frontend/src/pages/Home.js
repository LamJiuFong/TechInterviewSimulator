// src/pages/Home.js
import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


const Home = () => {
  const nav = useNavigate();

  return (
    <div>
      <h1>Welcome to Home Page!</h1>
      <Button class="button" onClick={() => nav('/admin/questions')}>
          View all questions
      </Button>
      <Button class="button" onClick={() => nav('/waiting-room')}>
          Start a new session
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Home;
