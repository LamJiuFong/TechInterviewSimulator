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
router.get('/', verifyAccessToken, verifyIsAdmin, getAllQuestions);
router.get('/:id', verifyAccessToken, verifyIsAdmin, getQuestionById);
router.get('/search/title', verifyAccessToken, verifyIsAdmin, getQuestionByTitle);

router.post('/', verifyAccessToken, verifyIsAdmin, createNewQuestion);

router.put('/:id', verifyAccessToken, verifyIsAdmin, updateQuestion);

router.delete('/:id', verifyAccessToken, verifyIsAdmin, deleteQuestion);

export default router;
