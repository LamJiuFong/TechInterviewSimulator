import { useState, useEffect } from 'react';
import { 
  addQuestion, 
  getAllQuestions, 
  getQuestionById,
  updateQuestion, 
  deleteQuestion 
} from '../api/questionApi';  // Import the necessary API functions

const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all questions on component mount
  useEffect(() => {
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
    };
    fetchQuestions();
  }, []);  // Empty array ensures it only runs once on mount

  const handleGetQuestionById = async (questionId) => {
    try {
      setLoading(true);
      const wantedQuestion = await getQuestionById(questionId);
      setQuestions([wantedQuestion]);  // Replacing all questions with the selected one
    } catch (err) {
      setError(err.message || 'Failed to fetch question');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (questionData) => {
    try {
      setLoading(true);
      const newQuestion = await addQuestion(questionData);
      // Add the new question to the local state
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    } catch (err) {
      setError(err.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a specific question and immediately reflect the change in the UI
  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      setLoading(true);
      const updatedQuestion = await updateQuestion(questionId, questionData);
      // Update the local state with the updated question, keeping other questions intact
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
    } catch (err) {
      setError(err.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a specific question and immediately reflect the change in the UI
  const handleDeleteQuestion = async (questionId) => {
    try {
      setLoading(true);
      await deleteQuestion(questionId);
      // Remove the deleted question from local state
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading,
    error,
    handleGetQuestionById,
    handleAddQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
  };
};

export default useQuestions;
