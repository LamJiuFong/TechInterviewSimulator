// src/api/authApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.API_GATEWAY_URL,  // Change this to api gateway url
});

// Login API function
export async function login(email, password) {
  try {
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
