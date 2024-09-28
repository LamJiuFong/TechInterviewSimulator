import express from 'express';
import {
  getAllQuestions,
  createNewQuestion,
  getQuestionById,
  getQuestionByTitle,
  updateQuestion,
  deleteQuestion
} from '../controller/question-controller.js';  // Import the controller functions

import { getAllQuestions, findQuestionById, postQuestion } from '../controller/question-controller.js'; // Use `import` and .js extension for ES modules

const router = express.Router();

// Define the routes
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/search/title', getQuestionByTitle);

/**
router.post('/', createNewQuestion);

router.put('/:id', updateQuestion);

router.delete('/:id', deleteQuestion);
*/

router.get("/:questionId", findQuestionById);

router.post("/", postQuestion); // create question

export default router;
