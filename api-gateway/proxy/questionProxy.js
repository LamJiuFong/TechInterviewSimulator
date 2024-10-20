import { createProxyMiddleware } from "http-proxy-middleware";

export const QUESTION_SERVICE = process.env.QUESTION_SERVICE;

export const questionProxy = createProxyMiddleware({
    target: QUESTION_SERVICE,
    changeOrigin: true,
})