import express from 'express';
import {
  getAllQuestions,
  createNewQuestion,
  getQuestionById,
  getQuestionByTitle,
  updateQuestion,
  deleteQuestion
} from '../controller/question-controller.js';  // Import the controller functions

import { verifyAccessToken, verifyIsAdmin } from '../../user-service/middleware/basic-access-control.js';

const router = express.Router();

// Define the routes
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/search/title', getQuestionByTitle);

router.post('/', createNewQuestion);

router.put('/:id', updateQuestion);

router.delete('/:id', deleteQuestion);

export default router;