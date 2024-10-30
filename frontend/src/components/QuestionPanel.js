import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Button, Chip, Link } from '@mui/material';
import CodeEditor from './CodeEditor';

// Sample list of questions following your structure
const questions = [
  {
    _id: "66f95f936583103818ea51cc",
    title: "Add Binary",
    description: "Given two binary strings a and b, return their sum as a binary string.",
    difficulty: "Easy",
    categories: ["Bit Manipulation", "Algorithms"],
    examples: [
      { input: "a = '11', b = '1'", output: "'100'" },
      { input: "a = '1010', b = '1011'", output: "'10101'" }
    ],
    hints: ["Simulate the binary addition, managing carries."],
    link: "https://leetcode.com/problems/add-binary/"
  },
  {
    _id: "66f95f936583103818ea51cd",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    categories: ["Arrays", "Hash Map"],
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" }
    ],
    hints: ["Use a hash map to find the complement."],
    link: "https://leetcode.com/problems/two-sum/"
  },
  {
    _id: "66f95f936583103818ea51ce",
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "Easy",
    categories: ["Linked List"],
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ],
    hints: ["Iterate through the list and reverse pointers."],
    link: "https://leetcode.com/problems/reverse-linked-list/"
  },
  {
    _id: "66f95f936583103818ea51cf",
    title: "Merge Intervals",
    description: "Given an array of intervals, merge all overlapping intervals.",
    difficulty: "Medium",
    categories: ["Sorting", "Intervals"],
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    hints: ["Sort intervals and merge if they overlap."],
    link: "https://leetcode.com/problems/merge-intervals/"
  },
  {
    _id: "66f95f936583103818ea51d0",
    title: "Valid Parentheses",
    description: "Given a string containing only parentheses, check if it is valid.",
    difficulty: "Easy",
    categories: ["Stack"],
    examples: [
      { input: "s = '()'", output: "true" },
      { input: "s = '()[]{}'", output: "true" },
      { input: "s = '(]' ", output: "false" }
    ],
    hints: ["Use a stack to manage open parentheses."],
    link: "https://leetcode.com/problems/valid-parentheses/"
  }
];

const QuestionPanel = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showHints, setShowHints] = useState(false); // State to manage hint visibility

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Container for the question list and selected question (1/3 width) */}
      <Box sx={{ width: '33.33%', p: 2 }}>
        {/* Show question list only if no question is selected */}
        {!selectedQuestion ? (
          <>
            <Typography variant="h6" gutterBottom>
              Choose a question
            </Typography>
            <List>
              {questions.map((question) => (
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
      <Box sx={{ flex: 1, p: 4, display: selectedQuestion ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select a question from the list to view details.
        </Typography>
      </Box>
      {/* <CodeEditor /> */}
    </Box>
  );
};

export default QuestionPanel;
