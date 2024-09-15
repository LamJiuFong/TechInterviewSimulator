// routes/questionRoutes.js
const express = require('express');
const { getAllQuestions } = require('../controller/question-controller');
const router = express.Router();

// Route to get all questions
router.get('/', getAllQuestions);

module.exports = router;
