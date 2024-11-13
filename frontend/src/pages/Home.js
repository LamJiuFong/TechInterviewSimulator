// src/pages/Home.js
import './page-styles/Home.css';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import CreateIcon from '@mui/icons-material/Create';
import QuizIcon from '@mui/icons-material/Quiz';
import { useState, useEffect } from "react";
import { SettingsIcon } from 'lucide-react';

const Home = () => {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!loading && user) {
      setUsername(user.username);
    }
  }
  , [user, loading]);

  return (
    <div className='home-page'>
      <div className='welcome-title'>
        <h1>Welcome back {username}!</h1>
        <LogoutButton />
      </div>
      <div className='home-actions'>
        <Button class="session-button" onClick={() => nav('/waiting-room')}>
          <CreateIcon sx={{ fontSize: 35 }}/>
          <h2>Start a new session</h2>
        </Button>
        <Button class="question-button" onClick={() => nav('/admin/questions')}>
          <QuizIcon sx={{ fontSize: 30 }}/>
          <h2>View all questions</h2>
        </Button>
      </div>
      <Button class="setting-button" onClick={() => nav('/setting')}>
        <SettingsIcon  sx={{ fontSize: 30 }}/>
        <h2>Settings</h2>
      </Button>
    </div>
  );
};

export default Home;
