import express from 'express';
import { getAllQuestions, fetchQuestionById, postQuestion } from '../controller/question-controller.js'; // Use `import` and .js extension for ES modules

const router = express.Router();

// Route to get all questions
router.get('/', getAllQuestions);

router.get("/:questionId", fetchQuestionById);

router.post("/add", postQuestion);

export default router;
