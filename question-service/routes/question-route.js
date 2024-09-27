import express from 'express';
import { getAllQuestions, findQuestionById, postQuestion } from '../controller/question-controller.js'; // Use `import` and .js extension for ES modules

const router = express.Router();

// Route to get all questions
router.get('/', getAllQuestions);

router.get("/:questionId", findQuestionById);

router.post("/", postQuestion);

export default router;
