import { createProxyMiddleware } from "http-proxy-middleware";

export const USER_SERVICE = process.env.USER_SERVICE;
console.log(USER_SERVICE);

export const userProxy = createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,
    pathRewrite: {
        '^/auth/login': '/auth/login', // Adjust the path as needed
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${req.url}`); // Log the proxy request
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
})