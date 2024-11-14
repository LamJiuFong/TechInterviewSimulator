import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Button, Chip, Link } from '@mui/material';
import { getFilteredQuestions } from '../api/questionApi';

const QuestionPanel = ({ category, difficulty }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showHints, setShowHints] = useState(false); // State to manage hint visibility
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (questions.length == 0) {
      const fetchData = async () => {
        const res = await getFilteredQuestions(`category=${category}&difficulty=${difficulty}`);
        setQuestions([...res]);
      }

      fetchData();
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: "100%" }}>
      <Box sx={{ p: 2 , width: "100%"}}>
        {/* Show question list only if no question is selected */}
        {!selectedQuestion ? (
          <>
            <Typography variant="h6" gutterBottom>
              Choose a question
            </Typography>
            <List>
              {questions && questions.map((question) => (
                <ListItem key={question._id} disablePadding>
                  <ListItemButton onClick={() => {
                    setSelectedQuestion(question);
                    setShowHints(false); // Reset hints visibility when changing question
                  }}>
                    <ListItemText primary={question.title} secondary={question.difficulty} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          // Display selected question details
          <Box>
            <Button onClick={() => {
              setSelectedQuestion(null);
              setShowHints(false); // Reset hints visibility when going back to list
            }} variant="outlined" sx={{ mb: 2 }}>
              Back to Question List
            </Button>
            <Typography variant="h5" gutterBottom>
              {selectedQuestion.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Difficulty: {selectedQuestion.difficulty}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {selectedQuestion.categories.map((category) => (
                <Chip key={category} label={category} variant="outlined" />
              ))}
            </Box>
            <Typography variant="body1" gutterBottom>
              {selectedQuestion.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Examples
            </Typography>
            {selectedQuestion.examples.map((example, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Input:</strong> {example.input}
                </Typography>
                <Typography variant="body2">
                  <strong>Output:</strong> {example.output}
                </Typography>
              </Box>
            ))}
            <Typography variant="h6" gutterBottom>
              Hints
            </Typography>
            <Button
              onClick={() => setShowHints((prev) => !prev)}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
            {showHints && selectedQuestion.hints.map((hint, index) => (
              <Typography key={index} variant="body2">
                - {hint}
              </Typography>
            ))}
            <Box sx={{ mt: 2 }}>
              <Link href={selectedQuestion.link} target="_blank" rel="noopener" underline="hover">
                View Full Problem on LeetCode
              </Link>
            </Box>
          </Box>
        )}
      </Box>

      {/* Area to indicate if no question is selected */}
      {/* <Box sx={{ flex: 1, p: 4, display: selectedQuestion ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select a question from the list to view details.
        </Typography>
      </Box> */}
    </Box>
  );
};

export default QuestionPanel;
