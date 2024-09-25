import React from 'react';
import AdminQuestionList from '../components/AdminQuestionList';

export default function AdminQuestionView() {

  return (
    <div className='admin-question-list'>
      <h1>All Questions</h1>
      <AdminQuestionList />
    </div>
  );
}
