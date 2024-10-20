import axios from 'axios';
import { USER_SERVICE } from '../proxy/userProxy.js';

export async function verifyAccessToken(req, res, next) {
    try {
        console.log("verify");
        const response = await axios.post(`${USER_SERVICE}/auth/verify-token`, {
            header: req.header,
            data: req.data
        });
        req.user = response.data;
        next();
    } catch(err) {
        console.error("API Gateway -> Error verifying access token ", err);
        res.status(403).json({ message: "Invalid user"});
    }
}