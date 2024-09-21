import Question from '../model/question-model.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();  // Fetch all questions from DB
        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
