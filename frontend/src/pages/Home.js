// src/pages/Home.js
import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';


const Home = () => {
  return (
    <div>
      <h1>Welcome to Home Page!</h1>
      <Button class="button">
        <Link to={'/admin/questions'}>
            View all questions
        </Link>
      </Button>
      <Button class="button">
        <Link to={'/waiting-room'}>
            Start a new session
        </Link>
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Home;
