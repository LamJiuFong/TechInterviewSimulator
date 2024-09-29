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
    return questions;
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

// Todo:Remove below, dummy data
const questions = [
    {
        _id: "1",
        title: "FizzBuzz Problem",
        description: "Write a program that prints the numbers from 1 to 100. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
        categories: ["Algorithms", "Beginner"],
        difficulty: 0, // Easy
        links: [
            "https://en.wikipedia.org/wiki/Fizz_buzz",
            "https://example.com/fizzbuzz-tutorial"
        ],
        hints: [
            "Think about how to handle multiples of both 3 and 5.",
            "Consider using the modulo operator."
        ],
        examples: [
            {
                input: "n = 15",
                output: "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz"
            }
        ]
    },
    {
        _id: "2",
        title: "Two Sum",
        description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        categories: ["Algorithms", "Data Structures"],
        difficulty: 1, // Medium
        links: [
            "https://leetcode.com/problems/two-sum/",
            "https://example.com/two-sum-explanation"
        ],
        hints: [
            "Try using a hash map to store the difference of each element from the target.",
            "Iterate through the array only once."
        ],
        examples: [
            {
                input: "nums = [2, 7, 11, 15], target = 9",
                output: "[0, 1]"
            },
            {
                input: "nums = [3, 2, 4], target = 6",
                output: "[1, 2]"
            }
        ]
    },
    {
        _id: "3",
        title: "Palindrome Number",
        description: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
        categories: ["Mathematics", "Beginner"],
        difficulty: 0, // Easy
        links: [
            "https://leetcode.com/problems/palindrome-number/",
            "https://example.com/palindrome-checker"
        ],
        hints: [
            "Negative numbers cannot be palindromes.",
            "Consider converting the number to a string."
        ],
        examples: [
            {
                input: "x = 121",
                output: "true"
            },
            {
                input: "x = -121",
                output: "false"
            }
        ]
    },
    {
        _id: "4",
        title: "Merge Intervals",
        description: "Given a collection of intervals, merge all overlapping intervals.",
        categories: ["Algorithms", "Sorting"],
        difficulty: 2, // Hard
        links: [
            "https://leetcode.com/problems/merge-intervals/",
            "https://example.com/merge-intervals-tutorial"
        ],
        hints: [
            "Sort the intervals by the start time.",
            "Iterate through the intervals and merge when necessary."
        ],
        examples: [
            {
                input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                output: "[[1,6],[8,10],[15,18]]"
            },
            {
                input: "intervals = [[1,4],[4,5]]",
                output: "[[1,5]]"
            }
        ]
    }
];
