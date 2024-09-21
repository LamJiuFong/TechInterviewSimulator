import express from 'express';
import { getAllQuestions } from '../controller/question-controller.js'; // Use `import` and .js extension for ES modules

const router = express.Router();

// Route to get all questions
router.get('/', getAllQuestions);

export default router;
