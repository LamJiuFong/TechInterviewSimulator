import { 
    createQuestion, 
    findQuestionById, 
    findByTitle,
    findAllQuestions,
    updateQuestionById,
    deleteQuestionById,
} from "../model/repository.js";

// Create a new question

export const createNewQuestion = async (req, res) => {
    try {
        const { questionTitle, questionDescription, questionCategory, questionComplexity } = req.body;  // Extract question details from request body
        const existingQuestion = await findByTitle(questionTitle);  // Check if question already exists, in model question title defined as unique
        if (existingQuestion) {
            res.status(400).json({ message: "Question already exists" });
        } else {
            const newQuestion = await createQuestion(questionTitle, questionDescription, questionCategory, questionComplexity);  // Create a new question
            res.status(201).json(newQuestion);  // Send response as JSON
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await findAllQuestions();  // Fetch all questions from DB
        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;  // Extract questionId from request parameters
        const question = await findQuestionById(questionId);  // Fetch question from DB
        if (!question) {
            res.status(404).json({ message: "Question not found" });
        } else {
            res.status(200).json(question);  // Send response as JSON
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuestionByTitle = async (req, res) => {
    try {
        const { questionTitle } = req.params;
        const question = await findByTitle(questionTitle);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
        } else {
            res.status(200).json(question);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { questionTitle, questionDescription, questionCategory, questionComplexity } = req.body;
        const updatedQuestion = await updateQuestionById(questionId, questionTitle, questionDescription, questionCategory, questionComplexity);
        if (!updatedQuestion) {
            res.status(404).json({ message: "Question not found" });
        } else {
            res.status(200).json(updatedQuestion);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const deletedQuestion = await deleteQuestionById(questionId);
        if (!deletedQuestion) {
            res.status(404).json({ message: "Question not found" });
        } else {
            res.status(200).json(deletedQuestion);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};