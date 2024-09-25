import React, { useState, useRef } from 'react';
import AdminQuestionList from '../components/AdminQuestionList';
import QuestionForm from '../components/QuestionForm';
import { Button } from '@mui/material';

export default function AdminQuestionView() {
  const [open, setOpen] = useState(false);

  // Ref for the "Add Question" button to return focus to it after modal closes
  const addButtonRef = useRef(null);

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

      {/* Button to open the modal for adding a question */}
      <Button
        ref={addButtonRef}
        variant='outlined'
        onClick={() => setOpen(true)}
      >
        Add Question
      </Button>

      {/* Modal for adding a question */}
      <QuestionForm
        open={open}
        onClose={handleModalClose} // Call the handleModalClose function when the modal closes
        isUpdate={false}
      />

      {/* List of questions */}
      <AdminQuestionList />
    </div>
  );
}
