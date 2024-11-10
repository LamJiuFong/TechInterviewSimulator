import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const CODE_EXECUTION_SERVICE_URL = process.env.CODE_EXECUTION_SERVICE_URL || "http://localhost:3005";

export const codeExecutionProxy = createProxyMiddleware({
    target: CODE_EXECUTION_SERVICE_URL,
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
        console.error("Code Execution Proxy error:", err);
        res.status(500).send("Code execution proxy error");
    },
});