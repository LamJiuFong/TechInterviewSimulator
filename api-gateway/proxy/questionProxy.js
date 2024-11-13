import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const QUESTION_SERVICE = process.env.QUESTION_SERVICE_URL;

export const questionProxy = createProxyMiddleware({
    target: QUESTION_SERVICE,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Add user context from auth if available
            if (req.user) {
                proxyReq.setHeader('X-User-Data', JSON.stringify(req.user));
            }

            // Handle the body
            if (req.rawBody) {
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(req.rawBody));
                proxyReq.write(req.rawBody);
            } else if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    },
    onError: (err, req, res) => {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy error");
    },
});