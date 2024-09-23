import {Question, QuestionCategory} from '../model/question-model.js';
import {findQuestionById, createQuestion} from '../model/repository.js'

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();  // Fetch all questions from DB
        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function fetchQuestionById(req, res) {
    try {

        const question = await findQuestionById(req.params.questionId);

        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({message:"Question not found"});
        }

    } catch(err) {
        console.error("Error fetching question", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export async function postQuestion(req, res) {
    try {

        const data = req.body

        const question = await createQuestion(data.title, data.description, data.difficulty, data.categories, data.examples, data.hint);

        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({message:"Question creation failed"});
        }


    } catch(err) {
        console.error("Error creating question", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}