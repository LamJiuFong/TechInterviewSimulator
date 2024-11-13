import axios from 'axios';

const baseURL =
    process.env.ENV === "PROD"
        ? process.env.REACT_APP_AUTH_SERVICE_URL
        : process.env.REACT_APP_AUTH_SERVICE_LOCAL_URL;
  

const API = axios.create({
  baseURL: baseURL
});

// Login API function
export async function login(email, password) {
  try {
    console.log("User logging in from frontend");
    console.log(process.env.REACT_APP_AUTH_SERVICE_LOCAL_URL);
    
    const response = await API.post(`/auth/login`,{ email, password });
    return response.data; // Contains accessToken and user data
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
}

// Verify Token API function
export async function verifyToken(token) {
  try {
    const response = await API.get(`/auth/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token as Bearer token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error.response?.data || { message: 'Token verification failed' };
  }
}
