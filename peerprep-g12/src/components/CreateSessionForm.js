import './component-styles/CreateSessionForm.css';
import React, { useState } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Chip } from '@mui/material';

export default function CreateSessionForm({categories, handleCreateSession}) {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState([]);
  const [timer, setTimer] = useState(0);

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
        <button type='submit' className='create-session-button' onClick={handleCreateSession} variant="contained" color="primary" fullWidth>
            Create Session
        </button>
    </div>
  )
}
