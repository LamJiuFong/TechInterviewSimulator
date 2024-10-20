import express from 'express';
import axios from 'axios';
import { verifyAccessToken } from '../middleware/authentication.js';
import { verifyIsAdmin } from '../middleware/authorization.js';

const QUESTION_SERVICE = process.env.QUESTION_SERVICE;

export const questionRouter = express.Router();

// Create question
questionRouter.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${QUESTION_SERVICE}/api/questions/`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get all questions
questionRouter.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get filtered questions
questionRouter.get('/filter', async (req, res) => {
    try {
        const queryString = req.originalUrl.split('?')[1] || '';
        console.log('Query String:', queryString);
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/filter?${queryString}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get question by id
questionRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Update question by id
questionRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`${QUESTION_SERVICE}/api/questions/${id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Delete question by id
questionRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${QUESTION_SERVICE}/api/questions/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get all question categories
questionRouter.get('/categories/all', async (req, res) => {
    try {
        const response = await axios.get(`${QUESTION_SERVICE}/api/questions/categories/all`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});