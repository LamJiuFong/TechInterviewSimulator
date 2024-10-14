import React from 'react'
import CreateSessionForm from '../components/CreateSessionForm'
import useQuestions from '../hooks/useQuestions'

export default function WaitingRoom() {
  const { categories } = useQuestions();
  const handleCreateSession = () => {
    console.log('Session created!');
  }

  return (
    <div>
        <h1>Create a session now!</h1>
        <CreateSessionForm categories={categories} handleCreateSession={handleCreateSession}/>
    </div>
  )
}
