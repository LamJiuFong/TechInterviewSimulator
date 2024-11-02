import express from "express";
import axios from "axios";
import { verifyAccessToken } from "../middleware/authentication.js";
import { verifyIsAdmin } from "../middleware/authorization.js";

const QUESTION_SERVICE =
    process.env.QUESTION_SERVICE_URL || "http://localhost:3002";

export const questionRouter = express.Router();

// Create question
questionRouter.post("/", async (req, res) => {
    try {
        const response = await axios.post(
            `${QUESTION_SERVICE}/api/questions/`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error creating question",
        });
    }
});

// Get all questions
questionRouter.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            `${QUESTION_SERVICE}/api/questions/`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error fetching all questions",
        });
    }
});

// Get filtered questions
questionRouter.get("/filter", async (req, res) => {
    try {
        const queryString = req.originalUrl.split("?")[1] || "";
        console.log("Query String:", queryString);
        const response = await axios.get(
            `${QUESTION_SERVICE}/api/questions/filter?${queryString}`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error fetching filtered questions",
        });
    }
});

// Get question by id
questionRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(
            `${QUESTION_SERVICE}/api/questions/${id}`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error fetching question by id",
        });
    }
});

// Update question by id
questionRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(
            `${QUESTION_SERVICE}/api/questions/${id}`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error updating question",
        });
    }
});

// Delete question by id
questionRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(
            `${QUESTION_SERVICE}/api/questions/${id}`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error deleting question",
        });
    }
});

// Get all question categories
questionRouter.get("/categories/all", async (req, res) => {
    try {
        const response = await axios.get(
            `${QUESTION_SERVICE}/api/questions/categories/all`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Error fetching question categories",
        });
    }
});
