import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useQuestions from '../hooks/useQuestions';
import { DialogActions } from '@mui/material';

export default function QuestionForm({ open, onClose, isUpdate, questionData = null }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [questionComplexity, setQuestionComplexity] = useState('');
  const { handleAddQuestion, handleUpdateQuestion } = useQuestions();
  const submitButtonRef = useRef(null);

  // useEffect to update form state when questionData changes
  useEffect(() => {
    if (isUpdate && questionData) {
      setQuestionTitle(questionData.questionTitle || '');
      setQuestionDescription(questionData.questionDescription || '');
      setQuestionCategory(questionData.questionCategory || '');
      setQuestionComplexity(questionData.questionComplexity || '');
    } else {
      // Reset form if no question data (for adding new questions)
      setQuestionTitle('');
      setQuestionDescription('');
      setQuestionCategory('');
      setQuestionComplexity('');
    }
  }, [isUpdate, questionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      questionTitle,
      questionDescription,
      questionCategory,
      questionComplexity,
    };

    if (isUpdate) {
      await handleUpdateQuestion(questionData._id, newQuestion);
    } else {
      await handleAddQuestion(newQuestion);
    }

    onClose(); // Close dialog after submission

    if (submitButtonRef.current) {
        submitButtonRef.current.focus();
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{isUpdate ? 'Update Question' : 'Add Question'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please {isUpdate ? 'update' : 'add'} the question details below
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
                required
                id='questionTitle'
                label='Question Title'
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                id='questionDescription'
                label='Question Description'
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                id='questionCategory'
                label='Question Category'
                value={questionCategory}
                onChange={(e) => setQuestionCategory(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                id='questionComplexity'
                label='Question Complexity'
                value={questionComplexity}
                onChange={(e) => setQuestionComplexity(e.target.value)}
                fullWidth
                margin='normal'
              />
                <DialogActions>
                    <Button ref={submitButtonRef} type='submit'>
                        Submit
                    </Button>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
