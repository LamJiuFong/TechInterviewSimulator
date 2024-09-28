import axios from 'axios';
import { getToken } from "../utils/token";

// Base configuration for the API
const API = axios.create({
  baseURL: 'http://localhost:3002', // Change to backend API URL if deployed
});

// Attach token if needed (authentication)
API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

//Create new question
export const createQuestion = async (questionData) => {
  try {
    const response = await API.post('/api/questions', questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error.response?.data?.message || error.message);
    throw error;
  }
};

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

// Update a question by ID
export const updateQuestion = async (questionId, questionData) => {
    try {
        const response = await API.put(`/api/questions/${questionId}`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error.response?.data?.message || error.message);
        throw error;
    }
}

//Delete a question by ID
export const deleteQuestion = async (questionId) => {
    try {
        const response = await API.delete(`/api/questions/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting question:', error.response?.data?.message || error.message);
        throw error;
    }
}

export const getQuestionCategories = async () => {
    try {
        // const response = await API.get('/api/categories');
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error.response?.data?.message || error.message);
        throw error;
    }
}

// Todo: Remove below, dummy data
const categories = [
    { _id: '1', name: 'Mathematics' },
    { _id: '2', name: 'Science' },
    { _id: '3', name: 'History' },
    { _id: '4', name: 'Literature' },
    { _id: '5', name: 'Technology' },
    { _id: '6', name: 'Arts' },
    { _id: '7', name: 'Geography' },
    { _id: '8', name: 'Physics' },
    { _id: '9', name: 'Chemistry' },
    { _id: '10', name: 'Biology' },
];
