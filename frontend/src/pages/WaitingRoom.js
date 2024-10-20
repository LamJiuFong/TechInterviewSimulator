import React, { useEffect, useState } from 'react'
import CreateSessionForm from '../components/CreateSessionForm'
import useQuestions from '../hooks/useQuestions'
import { useAuth } from '../context/AuthContext';
import { closeSocket, enterMatch, initializeSocket, cancelMatch } from '../api/matchingApi';

export default function WaitingRoom() {

  const [isTimeout, setTimeout] = useState('');
  const [isMatchFound, setMatchFound] = useState(''); 
  const { categories } = useQuestions();
  const { user } = useAuth();

  useEffect(() => {
    initializeSocket(user.id);
    return () => {
      closeSocket();
    };
  }, [user.id]);

  // TODO: write a hook to handle create session
  const handleCreateSession = (category, difficulty) => {
    enterMatch(category, difficulty, setMatchFound, setTimeout);
    console.log('Session created!');
  }

  const handleCancelMatch = () => {
    cancelMatch();
    console.log("Match cancelled!");
  }

  return (
    <div>
        <h1>Start practicing now</h1>
        <CreateSessionForm categories={categories} handleCreateSession={handleCreateSession} handleCancelMatch={handleCancelMatch} isMatchFound={isMatchFound} isTimeout={isTimeout}/>
    </div>
  )
}
