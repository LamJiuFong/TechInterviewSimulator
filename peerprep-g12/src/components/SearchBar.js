import React, { useState } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, Chip } from '@mui/material';
import useQuestions from '../hooks/useQuestions';


const SearchBar = () => {
  const [difficulty, setDifficulty] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState('');
  const { categories } = useQuestions();

  // Predefined difficulties
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (difficulty) {
      params.append('difficulty', difficulty);
    }
    
    if (selectedCategories && Array.isArray(selectedCategories)) {
        selectedCategories.forEach(category => {
        params.append('category', category); 
        });
    }
  
    if (title) {
      params.append('title', title);
    }
    setDifficulty("");
    setSelectedCategories([]);
    setTitle("");
    console.log(params.toString())
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Title Input */}
      <TextField
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Two Sum"
        fullWidth
      />

      {/* Difficulty Dropdown */}
      <FormControl fullWidth>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          labelId="difficulty-label"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          label="Difficulty"
        >
          {difficulties.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {diff}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Category Dropdown */}
      <FormControl fullWidth margin='normal'>
        <InputLabel id="questionCategory">Question Category</InputLabel>
        <Select
            id='questionCategory'
            label='Question Category'
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(e.target.value)}

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

      {/* Search Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
