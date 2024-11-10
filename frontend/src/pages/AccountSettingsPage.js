// AccountSettingsPage.js
import React from 'react';
import AccountSettingsForm from '../components/AccountSettingsForm';

const AccountSettingsPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Account Settings</h1>
      <AccountSettingsForm />
    </div>
  );
};

export default AccountSettingsPage;
