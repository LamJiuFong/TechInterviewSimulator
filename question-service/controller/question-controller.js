import {Question, QuestionCategory} from '../model/question-model.js';
import {findQuestionById as importedFindQuestionByID, createQuestion, getFilteredQuestions as getFilteredQuestionsDB} from '../model/repository.js'

import mongoose from 'mongoose';
// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();  // Fetch all questions from DB
        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get filtered questions based on query parameters
// Example route: /filter?difficulty=0,1&category=DP,Array
export const getFilteredQuestions = async (req, res) => {
    try {
        const { difficulty, category } = req.query;  // Extract query parameters
        
        let query = {};

        if (difficulty) {
            query.difficulty = { $in: difficulty.split(',') };  // Filter by difficulty
        }

        if (category) {
            query.categories = { $in: category.split(',') };  // Filter by category
        }
        
        const questions = await getFilteredQuestionsDB(query);


        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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