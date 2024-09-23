import React from 'react'
import useQuestions from '../hooks/useQuestions';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


export default function AdminQuestionList() {
  const {
    questions,
    loading,
    error,
    handleUpdateQuestion,
    handleDeleteQuestion,
  } = useQuestions();

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
                <Button onClick={() => handleUpdateQuestion(question._id, {...question, questionTitle: 'Example Updated Title'})}>Update</Button>
                <Button onClick={() => {
                  console.log(question._id);
                  handleDeleteQuestion(question._id)}}>Delete</Button>
              </AccordionActions>
            </Accordion>
          </div>
        ))
      }
    </div>
  )
}
