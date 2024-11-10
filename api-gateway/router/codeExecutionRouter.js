import express from "express";
import axios from "axios";
import { verifyAccessToken } from "../middleware/authentication.js";

const CODE_EXECUTION_SERVICE_URL =
    process.env.CODE_EXECUTION_SERVICE_URL || "http://localhost:3005";

export const codeExecutionRouter = express.Router();

console.log(CODE_EXECUTION_SERVICE_URL);

codeExecutionRouter.post("/submissions", async (req, res) => {
    try {
        const response = await axios.post(
            `${CODE_EXECUTION_SERVICE_URL}/api/code-execution/submissions`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

codeExecutionRouter.get("/submissions/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const response = await axios.get(
            `${CODE_EXECUTION_SERVICE_URL}/api/code-execution/submissions/${token}`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});
