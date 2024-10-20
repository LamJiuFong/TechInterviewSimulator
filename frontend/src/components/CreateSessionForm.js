import './component-styles/CreateSessionForm.css';
import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Chip } from '@mui/material';
import LoadingDots from './LoadingDots';

export default function CreateSessionForm({categories, handleCreateSession}) {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState([]);
  const [timer, setTimer] = useState(0);  // Track elapsed time
  const [loading, setLoading] = useState(false);  // Loading state
  const [errorMessage, setErrorMessage] = useState('');  // Error or success message
  const [matchTimeout] = useState(10);  // Timeout limit (10 seconds)

  // useEffect to handle the timer and match status
  useEffect(() => {
    let interval;
    
    if (loading) {
      // Increment the timer every second
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      // If timer reaches timeout, show failure message
      if (timer >= matchTimeout) {
        clearInterval(interval);
        setLoading(false);
        setErrorMessage('Failed to find a match. 😞');
      }

      // Need to handle case where match is found, then show sucess message
    }

    // Clean up the interval when the component unmounts or the timer stops
    return () => clearInterval(interval);
  }, [loading, timer, matchTimeout]);

  // Handle Create Session
  const handleSubmit = () => {
    if (difficulty && category.length > 0) {
      setLoading(true);  // Start loading
      setTimer(0);  // Reset the timer
      setErrorMessage('');  // Clear previous messages
      handleCreateSession();
    } else {
      alert('Please select a difficulty and at least one category.');
    }
  };

  return (
    <div component="form" className="create-session-form">
      <label style={{fontWeight: 'bold', padding: '5px 5px 5px 5px', fontSize: "20px"}}>
        Choose your session settings
      </label>

      <div className='session-form-input'>
        <FormControl>
          <InputLabel id="difficulty">Difficulty</InputLabel>
          <Select 
            labelId='difficulty-label' 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            label="Difficulty"
          >
            {difficulties.map((difficulty, index) => (
              <MenuItem key={index} value={difficulty}>{difficulty}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="questionCategory">Question Category</InputLabel>
          <Select
            id='questionCategory'
            label='Question Category'
            multiple
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            renderValue={(selected) => (
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{margin: 2}}/>
                ))}
              </div>
            )}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Submit Button */}
      <button 
        type='submit' 
        className='create-session-button' 
        onClick={handleSubmit} 
        variant="contained" 
        color="primary" 
        fullWidth
      >
        Create Session
      </button>

      {/* Loading Animation and Timer */}
      {loading && (
        <div className="loading-section">
          <LoadingDots />
          <span>Time elapsed: {timer}s</span>
        </div>
      )}

      {/* Error/Success Message */}
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}
