import axios from 'axios';
import { getToken } from "../utils/token";


const baseURL =
    process.env.ENV === "PROD"
        ? process.env.REACT_APP_CODE_EXECUTION_URL
        : process.env.REACT_APP_CODE_EXECUTION_LOCAL_URL;


const axiosInstance = axios.create({
  baseURL: baseURL
});

axiosInstance.interceptors.request.use((req) => {
    const token = getToken(); 
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

export const createSubmission = async (codeData) => {
    try {
        const response = await axiosInstance.post("/api/code-execution/submissions", codeData);
        return response.data;
    } catch (error) {
        console.error('Error creating submission:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const getSubmissionResult = async (token) => {
    try {
        const response = await axiosInstance.get(`/api/code-execution/submissions/${token}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching submission result:', error.response?.data?.message || error.message);
        throw error;
    }
};