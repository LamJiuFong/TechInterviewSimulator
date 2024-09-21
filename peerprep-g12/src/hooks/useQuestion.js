import { useState, useEffect } from 'react';
import { getAllQuestions, updateQuestion, deleteQuestion } from '../api/questionApi';  // Import the necessary API functions

const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // For search functionality

  // Fetch all questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getAllQuestions();
        setQuestions(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Function to update a specific question
  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      const updatedQuestion = await updateQuestion(questionId, questionData);
      // Update the local state with the updated question
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
    } catch (err) {
      setError(err.message || 'Failed to update question');
    }
  };

  // Function to delete a specific question
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      // Remove the deleted question from local state
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  // Function to search for questions by title or description
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter questions based on the search query
  const filteredQuestions = questions.filter((q) =>
    q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.questionDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    questions: filteredQuestions,
    loading,
    error,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleSearch,
    searchQuery,
  };
};

export default useQuestions;
