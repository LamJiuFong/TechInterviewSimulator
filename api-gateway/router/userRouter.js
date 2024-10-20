import express from 'express';
import axios from 'axios';
import { verifyAccessToken } from '../middleware/authentication.js';
import { verifyIsAdmin } from '../middleware/authorization.js';
import { verifyIsOwnerOrAdmin } from '../middleware/authorization.js';

const USER_SERVICE = process.env.USER_SERVICE;

export const userRouter = express.Router();

// Create user
userRouter.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE}/users`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get user
userRouter.get('/:userId', verifyAccessToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(`${USER_SERVICE}/users/${userId}`, {
            headers: req.headers,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Get all users
userRouter.get('/', verifyAccessToken, verifyIsAdmin, async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE}/users`, {
            headers: req.headers,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Update user profile 
userRouter.patch("/:userId", verifyAccessToken, verifyIsOwnerOrAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.patch(`${USER_SERVICE}/users/${userId}`, {
            headers: req.headers,
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
})

// Update user privilege 
userRouter.patch("/:userId/privilege", verifyAccessToken, verifyIsAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.patch(`${USER_SERVICE}/users/${userId}/privilege`, {
            headers: req.headers,
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Delete user
userRouter.delete("/:userId", verifyAccessToken, verifyIsOwnerOrAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.delete(`${USER_SERVICE}/users/${userId}`, {
            headers: req.headers,
            body: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
})

