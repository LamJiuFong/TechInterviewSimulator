import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const USER_SERVICE = process.env.USER_SERVICE_URL;

export const userProxy = createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy error");
    },
});