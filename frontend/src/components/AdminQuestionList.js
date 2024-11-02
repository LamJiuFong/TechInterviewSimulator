import './component-styles/AdminQuestionList.css';
import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import QuestionForm from './QuestionForm';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

export default function AdminQuestionList({ 
    questions, 
    error, 
    handleAddQuestion, 
    handleUpdateQuestion, 
    handleDeleteQuestion 
  }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleCloseError = () => {
    setShowError(false);
  }

  const handleOpenForUpdate = (question) => {
    setCurrentQuestion(question);
    setIsUpdate(true);     
    setOpen(true);     
  };

  // Function to handle opening the modal for adding a new question
  const handleOpenForAdd = () => {
    setCurrentQuestion(null);
    setIsUpdate(false);
    setOpen(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setCurrentQuestion(null);
    setOpen(false);
  };

  return (
    <div className='admin-question-list'>
      {(!questions || questions.length === 0) 
      ? 
        <div className='error'>No questions found</div> 
      : 
        (<></>) // not sure if it is good practice
      }

      {/* Add Question Button */}
      {user.isAdmin && 
      <Button 
        class='button'
        onClick={handleOpenForAdd} 
      >
        Add New Question
      </Button>
      }

      {/* Error Message */}
      {error && showError && (
        <Alert
          severity="error"
          style={{ marginBottom: '15px' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseError} // Close button to dismiss the alert
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Question List */}
      {questions.map((question) => (
        <div className='question-panel' key={question._id}>
          <Accordion className='question'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id={question._id}
            >
              {question.title}
            </AccordionSummary>
            <AccordionDetails>
              <p><strong>Description:</strong> {question.description}</p>

              {/* Display Categories */}
              <div>
                <p><strong>Categories:</strong></p>
                <ul>
                  {question.categories.map((category, index) => (
                      <li key={index}>{category}</li>
                  ))}
                </ul>
              </div>

              {/* Display Difficulty */}
              <p><strong>Difficulty:</strong> {question.difficulty}</p>
              {/* Display Links */}
              {question.link && (
                  <div>
                    <p><strong>Links:</strong>  <a href={question.link} target="_blank" rel="noopener noreferrer" className="blue-link">{question.link}</a></p>
                  </div>
              )}

              {/* Display Hints */}
              {question.hints && question.hints.length > 0 && (
                  <div>
                    <p><strong>Hints:</strong></p>
                    <ul>
                      {question.hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Display Examples */}
              {question.examples && question.examples.length > 0 && (
                  <div>
                    <p><strong>Examples:</strong></p>
                    {question.examples.map((example, index) => (
                        <div key={index}>
                          <p><strong>Example {index + 1}:</strong></p>
                          <p><strong>Input:</strong> {example.input}</p>
                          <p><strong>Output:</strong> {example.output}</p>
                        </div>
                    ))}
                  </div>
              )}

            </AccordionDetails>
            {user.isAdmin &&
              <AccordionActions>
                <Button onClick={() => handleOpenForUpdate(question)}>Update</Button>
                <Button onClick={() => handleDeleteQuestion(question._id)}>
                  Delete
                </Button>
              </AccordionActions>
            }
          </Accordion>
        </div>
      ))}

      {/* Question Form for Add or Update */}
      {/* Current Implementation: Singleton, depends on currentQuestion */}
      <QuestionForm
        open={open} 
        onClose={handleClose} 
        isUpdate={isUpdate} 
        questionData={currentQuestion} 
        update={handleUpdateQuestion}
        add={handleAddQuestion}
      />
    </div>
  );
}
