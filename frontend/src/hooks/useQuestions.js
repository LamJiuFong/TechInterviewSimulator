import { useState, useEffect } from 'react';
import { 
  createQuestion,
  getAllQuestions,
  getFilteredQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionCategories,
} from '../api/questionApi';

const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getQuestionCategories(); // Fetch categories
      setCategories(data);  // Set categories state
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all questions on component mount
  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, []);

  const handleGetQuestionById = async (questionId) => {
    try {
      const wantedQuestion = await getQuestionById(questionId);
      setQuestions([wantedQuestion]);  // Replacing all questions with the selected one
    } catch (err) {
      setError(err.message);
    } 
  };

  const handleAddQuestion = async (questionData) => {
    try {
      const newQuestion = await createQuestion(questionData);
      // Add the new question to the local state
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to update a specific question and immediately reflect the change in the UI
  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      const updatedQuestion = await updateQuestion(questionId, questionData);
      console.log("Before adding: ", questions);
      // Update the local state with the updated question, keeping other questions intact
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
      console.log("After adding: ", questions);
    } catch (err) {
      setError(err.message);
    } 
  };

  // Function to delete a specific question and immediately reflect the change in the UI
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      // Remove the deleted question from local state
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.message);
    } 
  };

  const handleFilterQuestion = async (queryString) => {
    try {
      const filteredQuestion = await getFilteredQuestions(queryString);
      // Update the question list to filtered question
      setQuestions(filteredQuestion);
    } catch (err) {
      setError(err.message);
    } 
  };

  return {
    questions,
    categories,
    loading,
    error,
    fetchQuestions,
    handleGetQuestionById,
    handleAddQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleFilterQuestion,
  };
};

export default useQuestions;
