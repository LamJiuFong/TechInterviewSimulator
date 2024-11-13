import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const QUESTION_SERVICE = process.env.QUESTION_SERVICE_URL;

export const questionProxy = createProxyMiddleware({
    target: QUESTION_SERVICE,
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody
    },
    onError: (err, req, res) => {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy error");
    },
});