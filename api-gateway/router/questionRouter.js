import express from 'express';
import axios from 'axios';
import { verifyAccessToken } from '../middleware/authentication.js';
import { verifyIsAdmin } from '../middleware/authorization.js';

const QUESTION_SERVICE = process.env.QUESTION_SERVICE;

export const questionRouter = express.Router();

// Create question
questionRouter.post('/', verifyAccessToken, verifyIsAdmin, async (req, res) => {
    try {
        const response = await axios.post(`${QUESTION_SERVICE}/api/questions/`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get all questions
questionRouter.get('/', verifyAccessToken, async (req, res) => {
    try {
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get filtered questions
questionRouter.get('/filter', verifyAccessToken, async (req, res) => {
    try {
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/filter`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get question by id
questionRouter.get('/:id', verifyAccessToken, async (req, res) => {
    try {
        const { questionId } = req.params;
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/${questionId}`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Update question by id
questionRouter.put('/:id', verifyAccessToken, verifyIsAdmin, async (req, res) => {
    try {
        const { questionId } = req.params;
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/${questionId}`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Delete question by id
questionRouter.delete('/:id', verifyAccessToken, verifyIsAdmin, async (req, res) => {
    try {
        const { questionId } = req.params;
        const response = await axios.delete(`${QUESTION_SERVICE}/api/questions/${questionId}`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get all question categories
questionRouter.get('/categories/all', verifyAccessToken, async (req, res) => {
    try {
        const response = await axios.delete(`${QUESTION_SERVICE}/api/questions/categories/all`, {
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});