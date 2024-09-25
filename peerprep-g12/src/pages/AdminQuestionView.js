import React, { useState, useRef } from 'react';
import AdminQuestionList from '../components/AdminQuestionList';
import QuestionForm from '../components/QuestionForm';
import { Button } from '@mui/material';
import useQuestions from '../hooks/useQuestions';

export default function AdminQuestionView() {
  const [open, setOpen] = useState(false);
  const addButtonRef = useRef(null);
  const { handleAddQuestion, handleUpdateQuestion } = useQuestions();

  const handleModalClose = () => {
    setOpen(false);

    // Return focus to the "Add Question" button after modal closes
    if (addButtonRef.current) {
      addButtonRef.current.focus();
    }
  };

  return (
    <div className='admin-question-list'>
      <h1>All Questions</h1>
      <Button ref={addButtonRef} variant='outlined' onClick={() => setOpen(true)}>
        Add Question
      </Button>
      <QuestionForm 
        open={open} 
        onClose={handleModalClose} 
        isUpdate={false} 
        questionData={null}
        update={handleUpdateQuestion}
        add={handleAddQuestion}
      />
      <AdminQuestionList />
    </div>
  );
}
