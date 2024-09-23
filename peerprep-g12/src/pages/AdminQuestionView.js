import React from 'react'
import AdminQuestionList from '../components/AdminQuestionList'
import useQuestions from '../hooks/useQuestions'
import { Button } from '@mui/material'

export default function AdminQuestionView() {
  const { handleAddQuestion } = useQuestions()

  return (
    <div className='admin-question-list'>
      <h1>All Questions</h1>
      <Button onClick={() => handleAddQuestion({ questionTitle: 'Example Title', questionDescription: 'Example Description', questionCategory: 'Example Category', questionComplexity: 'Example Complexity' })}>Add Question</Button>
      <AdminQuestionList />
    </div>
  )
}
