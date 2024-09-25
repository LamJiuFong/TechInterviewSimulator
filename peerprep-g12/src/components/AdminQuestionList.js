import React, { useState } from 'react'
import useQuestions from '../hooks/useQuestions';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import QuestionForm from './QuestionForm';


export default function AdminQuestionList() {
  const {
    questions,
    loading,
    error,
    handleAddQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
  } = useQuestions();

  // State to track the modal open state
  const [open, setOpen] = useState(false)
  // State to track the current question being edited
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Function to handle opening the modal for a specific question
  const handleOpen = (question) => {
    setCurrentQuestion(question); // Set the current question
    setOpen(true); // Open the modal
  };

  // Function to handle closing the modal
  const handleClose= () => {
    setCurrentQuestion(null); // Reset the current question
    setOpen(false); // Close the modal
  };

  if (loading) {
    return <div className='loading'>Loading......</div>
  }

  if (error) {
    return <div className='error'>{error}</div>
  }

  if (!questions) {
    return <div className='error'>No questions found, add a question now!</div>
  }

  return (
    <div className='admin-question-list'>
      {
        questions && questions.map(question => (
          <div className='question-panel' key={question._id}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id={question._id}
              >
                {question.questionTitle}
              </AccordionSummary>
              <AccordionDetails>
                <p>{question.questionDescription}</p>
                <p>{question.questionCategory}</p>
                <p>{question.questionComplexity}</p>
              </AccordionDetails>
              <AccordionActions>
                <Button onClick={() => handleOpen(question)}>Update</Button>
                <QuestionForm 
                  open={open} 
                  onClose={handleClose} 
                  isUpdate={true} 
                  questionData={currentQuestion}
                  update={handleUpdateQuestion}
                  add={handleAddQuestion}
                />
                <Button onClick={() => {
                  console.log(question._id);
                  handleDeleteQuestion(question._id)}}>
                    Delete
                </Button>
              </AccordionActions>
            </Accordion>
          </div>
        ))
      }
    </div>
  )
}
