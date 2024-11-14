import express from "express";
import axios from "axios";

const USER_SERVICE = process.env.USER_SERVICE_URL || "http://localhost:3001";

export const authRouter = express.Router();

// Login
authRouter.post("/login", async (req, res) => {
    try {
        console.log("User attempting to log in through API Gateway");
        const response = await axios.post(
            `${USER_SERVICE}/auth/login`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || "Login failed",
        });
    }
});

// Token verification
authRouter.get("/verify-token", async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE}/auth/verify-token`, {
            headers: req.headers,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message,
        });
    }
});
