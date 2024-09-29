import express from 'express';
import { createQuestion, getAllQuestions, getQuestionById, updateQuestionById, deleteQuestionById, getFilteredQuestions } from '../controller/question-controller.js'; // Use `import` and .js extension for ES modules

const router = express.Router();

// Define the routes
router.post("/", createQuestion);

router.get('/', getAllQuestions);

router.get('/filter', getFilteredQuestions);

router.get("/:id", getQuestionById);

router.put('/:id', updateQuestionById);

router.delete('/:id', deleteQuestionById);

/** Not supported yet
router.get('/search/title', getQuestionByTitle);
*/

export default router;
