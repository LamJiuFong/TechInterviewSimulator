import axios from 'axios';
import { getToken } from "../utils/token"; 

// Base configuration for the API
const API = axios.create({
  baseURL: 'http://localhost:3001', // Change to backend API URL if deployed
});

// Attach token if needed (authentication)
API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Fetch all questions from the question-service
export const getAllQuestions = async () => {
  try {
    const response = await API.get('/api/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Fetch a single question by ID
export const getQuestionById = async (questionId) => {
  try {
    const response = await API.get(`/api/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error.response?.data?.message || error.message);
    throw error;
  }
};
