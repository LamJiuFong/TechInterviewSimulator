import axios from 'axios';
import { getToken } from "../utils/token";

const baseURL =
    process.env.ENV === "PROD"
        ? process.env.REACT_APP_QUESTION_SERVICE_URL
        : process.env.REACT_APP_QUESTION_SERVICE_LOCAL_URL;

// Base configuration for the API
const API = axios.create({
  baseURL: baseURL
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
    throw error.response?.data || { message: 'Error creating question' };
  }
};

// Fetch all questions from the question-service
export const getAllQuestions = async () => {
  try {
    const response = await API.get('/api/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error.response?.data?.message || error.message);
    throw error.response?.data || { message: 'Error getting all questions' };
  }
};

// Fetch a single question by ID
export const getQuestionById = async (questionId) => {
  try {
    const response = await API.get(`/api/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error.response?.data?.message || error.message);
    throw error.response?.data || { message: 'Error getting question' };
  }
};

// Update a question by ID
export const updateQuestion = async (questionId, questionData) => {
    try {
        const response = await API.put(`/api/questions/${questionId}`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error.response?.data?.message || error.message);
        throw error.response?.data || { message: 'Error updating question' };
    }
}

//Delete a question by ID
export const deleteQuestion = async (questionId) => {
    try {
        const response = await API.delete(`/api/questions/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting question:', error.response?.data?.message || error.message);
        throw error.response?.data || { message: 'Error deleting question' };
    }
}

export const getQuestionCategories = async () => {
    try {
        const response = await API.get('/api/questions/categories/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error.response?.data?.message || error.message);
        throw error.response?.data || { message: 'Error getting question categories' };
    }
}

export const getFilteredQuestions = async (queryString) => {
  try {
      const response = await API.get(`/api/questions/filter?${queryString}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching categories:', error.response?.data?.message || error.message);
      throw error.response?.data || { message: 'Error getting filtered questions' };
  }
}
