import axios from 'axios';
import { USER_SERVICE } from '../proxy/userProxy.js';

export async function verifyAccessToken(req, res, next) {
    try {
        console.log('Verify: Request headers:', req.headers);
        
        // Save the original headers and body
        const originalHeaders = { ...req.headers };
        const originalBody = req.body;

        // Modify headers specifically for this request
        const headers = { ...originalHeaders, 'Content-Length': '0' };

        // Perform the GET request with modified headers
        const response = await axios.get(`${USER_SERVICE}/auth/verify-token`, {
            headers: headers
        });

        // Restore the original headers and body for the next middleware
        req.headers = originalHeaders;
        req.body = originalBody;

        // Attach user data to req for the next middleware
        req.user = response.data;
        
        console.log('Authentication successful:', {
            userId: response.data?.id,
            method: req.method,
            path: req.path
        });

        next();
    } catch(err) {
        console.error("API Gateway -> Error verifying access token ", err.response?.data || err.message);
        res.status(403).json({ message: "Invalid user"});
    }
}