// api.js
import axios from 'axios';
import { getToken, setToken, removeToken } from "../utils/token";

// Base configuration for the API
const API = axios.create({
  baseURL: 'http://localhost:3001',  // Change this to your actual backend URL
});

// Attach token if needed (authentication)
API.interceptors.request.use((req) => {
  const token = getToken(); 
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


export const createUser = async (userData) => {
    try {
      const response = await API.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Get a user by ID
  export const getUser = async (userId) => {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Get all users
  export const getAllUsers = async () => {
    try {
      const response = await API.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Update user by ID
  export const updateUser = async (userId, userData) => {
    try {
      const response = await API.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Delete user by ID
  export const deleteUser = async (userId) => {
    try {
      const response = await API.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response?.data?.message || error.message);
      throw error;
    }
  };
  
  // Update user privilege (isAdmin)
  export const updateUserPrivilege = async (userId, isAdmin) => {
    try {
      const response = await API.patch(`/users/${userId}/privilege`, { isAdmin });
      return response.data;
    } catch (error) {
      console.error('Error updating user privilege:', error.response?.data?.message || error.message);
      throw error;
    }
  };