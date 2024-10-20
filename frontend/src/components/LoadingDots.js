import './component-styles/LoadingDots.css';
import React from 'react'

export default function LoadingDots() {
  return (
    <div className="loading-container">
      <span className="loading-text">Finding you a match</span>
      <div id="wave">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  )
}
