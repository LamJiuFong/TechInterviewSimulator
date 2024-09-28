import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import useQuestions from '../hooks/useQuestions';

export default function QuestionForm({ open, onClose, isUpdate, questionData = null, update, add }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [questionComplexity, setQuestionComplexity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const { error } = useQuestions();
  const complexities = [
    {
      value: 0,
      label: 'Easy',
    },
    {
      value: 1,
      label: 'Medium',
    },
    {
      value: 2,
      label: 'Hard',
    }
  ]

  // useEffect to update form state when questionData changes
  useEffect(() => {
    setErrorMsg(null);
    if (isUpdate && questionData) {
      setQuestionTitle(questionData.title || '');
      setQuestionDescription(questionData.description || '');
      setQuestionCategory(questionData.categories || '');
      setQuestionComplexity(questionData.difficulty || '');
    } else {
      // Reset form if no question data (for adding new questions)
      setQuestionTitle('');
      setQuestionDescription('');
      setQuestionCategory('');
      setQuestionComplexity('');
    }
  }, [open, isUpdate, questionData, errorMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: match category to the desired format, add hint, add examples
    const newQuestion = {
      title: questionTitle,
      description: questionDescription,
      categories: questionCategory,
      difficulty: questionComplexity,
    };

    try {
      if (isUpdate) {
        update(questionData._id, newQuestion);
      } else {
        add(newQuestion);
      }
  
      onClose(); // Close dialog after submission

    } catch (err) {
      setErrorMsg(err.message || 'Error occured while submitting the form');
    } 
  };

  if (error) {
    return <Alert severity="error">{errorMsg}</Alert>;
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{isUpdate ? 'Update Question' : 'Add Question'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please {isUpdate ? 'update' : 'add'} the question details below
          </DialogContentText>
          {errorMsg && (
            <Alert severity="error" style={{ marginBottom: '15px' }}>
              {errorMsg}
            </Alert>
          )}
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
              required
              id='questionDescription'
              label='Question Description'
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
              fullWidth
              margin='normal'
            />
            <TextField
              required
              id='questionCategory'
              label='Question Category'
              value={questionCategory}
              onChange={(e) => setQuestionCategory(e.target.value)}
              fullWidth
              margin='normal'
            />
            <TextField
              required
              id='questionComplexity'
              select
              label='Question Complexity'
              value={questionComplexity}
              onChange={(e) => setQuestionComplexity(e.target.value)}
              fullWidth
              margin='normal'
            >
              {complexities.map((complexity) => (
                <MenuItem key={complexity.value} value={complexity.value}>
                  {complexity.label}
                </MenuItem>
              ))}
            </TextField>
            <DialogActions>
                <Button type='submit'>
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
