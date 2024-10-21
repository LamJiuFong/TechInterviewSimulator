import axios from 'axios';
import "dotenv/config";

const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3002';

// Base configuration for the API
const API = axios.create({
    baseURL: QUESTION_SERVICE_URL, // Change to backend API URL if deployed
  });
  


export const fetchCategories = async () => {
    try {
        const response = await API.get('/api/questions/categories/all');
        const names = response.data.map(item => item.name);
        return names;
    } catch (error) {
        console.error('Error fetching categories:', error.response?.data?.message || error.message);
        throw error;
    }
}