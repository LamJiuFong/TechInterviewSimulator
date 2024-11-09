import express from "express";
import "dotenv/config";
import { userProxy } from "./proxy/userProxy.js";
import { questionProxy } from "./proxy/questionProxy.js";
import { verifyAccessToken } from "./middleware/authentication.js";
import cors from "cors";
import { authRouter } from "./router/authRouter.js";
import { codeExecutionProxy } from "./proxy/codeExecutionProxy.js";

export const QUESTION_SERVICE =
    process.env.QUESTION_SERVICE_URL || "http://localhost:3002";

export const app = express();

app.use(cors());
app.use(express.json());

// To handle CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Browsers usually send this before PUT or POST Requests
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, DELETE, PUT, PATCH"
        );
        return res.status(200).json({});
    }

    next();
});

app.use("/auth", authRouter);
app.use("/question", verifyAccessToken, questionProxy);
app.use("/user", userProxy)
app.use("/code-execution", verifyAccessToken, codeExecutionProxy)

app.listen(3210, () => {
    console.log("Backend listening on port 3003");
});
