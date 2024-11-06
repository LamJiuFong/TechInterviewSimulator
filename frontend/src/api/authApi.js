// src/api/authApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://afded85ef6ffc4642b1745c5836c3a93-1402287292.ap-southeast-1.elb.amazonaws.com:3003",  // Change this to api gateway url
});

// Login API function
export async function login(email, password) {
  try {
    console.log("User logging in from frontend");
    
    const response = await API.post(`/auth/login`,{ email, password });
    return response.data; // Contains accessToken and user data
  } catch (error) {
    console.error('Login error:', error);
    throw error.response.data || { message: 'Login failed' };
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
    throw error.response.data || { message: 'Token verification failed' };
  }
}
