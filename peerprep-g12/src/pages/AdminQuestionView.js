import './page-styles/AdminQuestionView.css';
import React from 'react';
import AdminQuestionList from '../components/AdminQuestionList';

export default function AdminQuestionView() {

  return (
    <div>
      <h1 className='all-questions-title'>All Questions</h1>
      <AdminQuestionList />
    </div>
  );
}
