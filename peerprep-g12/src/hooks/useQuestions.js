import { useState, useEffect } from 'react';
import { 
  addQuestion, 
  getAllQuestions, 
  getQuestionById,
  updateQuestion, 
  deleteQuestion 
} from '../api/questionApi';

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
  }, []);

  useEffect(() => {
    console.log("Questions state updated:", questions);
  }, [questions]);

  const handleGetQuestionById = async (questionId) => {
    try {
      const wantedQuestion = await getQuestionById(questionId);
      setQuestions([wantedQuestion]);  // Replacing all questions with the selected one
    } catch (err) {
      setError(err.message || 'Failed to fetch question');
    } 
  };

  const handleAddQuestion = async (questionData) => {
    try {
      const newQuestion = await addQuestion(questionData);
      // Add the new question to the local state
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    } catch (err) {
      setError(err.message || 'Failed to add question');
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
      setError(err.message || 'Failed to update question');
    } 
  };

  // Function to delete a specific question and immediately reflect the change in the UI
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      // Remove the deleted question from local state
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.message || 'Failed to delete question');
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
