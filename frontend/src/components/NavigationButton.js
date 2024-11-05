import './component-styles/NavigationButton.css';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function NavigationButton({ path, link }) {
    const nav = useNavigate();

  return (
    <div>
      <button className='nav-button' onClick={() => nav('/home')}>Back to {path}</button>
    </div>
  )
}
