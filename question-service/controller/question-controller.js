import { 
    createQuestion, 
    findQuestionById, 
    findByTitle,
    findAllQuestions,
    updateQuestionById,
    deleteQuestionById,
} from "../model/repository.js";

import { isValidObjectId } from 'mongoose';
import {Question, QuestionCategory} from '../model/question-model.js';
import {findQuestionById as importedFindQuestionByID, createQuestion} from '../model/repository.js'

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await findAllQuestions();  // Fetch all questions from DB
        return res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* Currently not supporting this yet?
export const getQuestionByTitle = async (req, res) => {
    try {
        const { questionTitle } = req.body;
        const question = await findByTitle(questionTitle);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        } else {
            return res.status(200).json(question);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
*/

/**
export const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        if (!isValidObjectId(questionId)) {
            return res.status(404).json({ message: `Question ${questionId} not found` });
        }

        const { questionTitle, questionDescription, questionCategory, questionComplexity } = req.body;

        //check if question is changed to a different question that already exists
        const existingQuestion = await findByTitle(questionTitle);
       
        if (existingQuestion) {
            if (existingQuestion._id.toString() !== questionId){
                return res.status(400).json({ message: "Question with this title already exists" });
            }
        }
        
        const updatedQuestion = await updateQuestionById(questionId, questionTitle, questionDescription, questionCategory, questionComplexity);
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        } else {
            return res.status(200).json(updatedQuestion);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
*/

/**
export const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        if (!isValidObjectId(questionId)) {
            return res.status(404).json({ message: `Question ${questionId} not found` });
        }

        const deletedQuestion = await deleteQuestionById(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        } else {
            return res.status(200).json(deletedQuestion);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
*/
export async function findQuestionById(req, res) {
    try {

        const question = await importedFindQuestionByID(req.params.questionId);

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

// create question
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
