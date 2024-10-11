import './page-styles/AdminQuestionView.css';
import React from 'react';
import AdminQuestionList from '../components/AdminQuestionList';
import SearchBar from '../components/SearchBar';
import useQuestions from '../hooks/useQuestions';
import CircularProgress from '@mui/material/CircularProgress';


export default function AdminQuestionView() {
  const {
    questions,
    categories,
    loading,
    error,
    handleAddQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleFilterQuestion,
  } = useQuestions();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div>
      <h1 className='all-questions-title'>All Questions</h1>
      
      <SearchBar 
        categories={categories} 
        handleFilterQuestion={handleFilterQuestion} />
      <AdminQuestionList  
        questions={questions}
        error={error}
        handleAddQuestion={handleAddQuestion}
        handleUpdateQuestion={handleUpdateQuestion}
        handleDeleteQuestion={handleDeleteQuestion}/>
    </div>
  );
}
