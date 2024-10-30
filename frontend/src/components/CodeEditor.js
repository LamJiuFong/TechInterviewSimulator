import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Button, MenuItem, Select, TextField, CircularProgress } from '@mui/material';
import useCodeExecution from '../hooks/useCodeExecution';

const languageOptions = [
  { "language_id": 50, "label": "C (GCC 9.2.0)" },
  { "language_id": 54, "label": "C++ (GCC 9.2.0)" },
  { "language_id": 51, "label": "C# (Mono 6.6.0.161)" },
  { "language_id": 60, "label": "Go (1.13.5)" },
  { "language_id": 62, "label": "Java (OpenJDK 13.0.1)" },
  { "language_id": 63, "label": "JavaScript (Node.js 12.14.0)" },
  { "language_id": 71, "label": "Python (3.8.1)" }
];

const CodeEditor = () => {
  const [language, setLanguage] = useState(71); // Default to Python
  const [code, setCode] = useState('');
  
  const {
    loading,
    error,
    submissionToken,
    status,
    stdout,
    stderr,
    handleCreateSubmission,
    handleGetSubmissionResult,
  } = useCodeExecution();

  useEffect(() => {
    // Poll for results when submission token exists
    if (submissionToken) {
      const interval = setInterval(() => {
        handleGetSubmissionResult(submissionToken);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [submissionToken, handleGetSubmissionResult]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleRun = async () => {
    console.log('Running code:', code);
    console.log(language)
    await handleCreateSubmission({
      languageId: language,
      code: code
    });
  };

  const LoadingButton = () => (
    <Button 
      variant="contained" 
      disabled 
      sx={{
        bgcolor: 'primary.main',
        '&.Mui-disabled': {
          bgcolor: 'primary.light',
          color: 'white'
        }
      }}
    >
      <CircularProgress 
        size={20} 
        sx={{ 
          color: 'white',
          marginRight: 1 
        }} 
      />
      Running...
    </Button>
  );

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        color: '#fff', 
        padding: '16px',
      }}
    >
      <Toolbar 
        sx={{ 
          bgcolor: '#2d2d2d', 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '0 16px',
        }}
      >
        <Select
          value={language}
          onChange={handleLanguageChange}
          size="small"
          sx={{ 
            color: '#fff',
            '& .MuiSelect-icon': {
              color: '#fff'
            }
          }}
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.language_id} value={option.language_id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        
        {loading ? <LoadingButton /> : (
          <Button 
            variant="contained" 
            onClick={handleRun} 
            size="small"
          >
            Run
          </Button>
        )}
      </Toolbar>

      <Box sx={{ display: 'flex', flexDirection: 'column', my: 2 }}>
        <TextField
          multiline
          rows={15}
          value={code}
          onChange={handleCodeChange}
          variant="filled"
          placeholder="Enter your code here"
          sx={{
            fontSize: '14px',
            bgcolor: '#2d2d2d',
            color: '#fff',
            '& .MuiInputBase-root': {
              height: '100%',
              color: '#fff'
            },
            '& .MuiFilledInput-input': {
              color: '#fff'
            }
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
        <Box 
          sx={{  
            width: '50%',
            bgcolor: '#000000', 
            padding: '16px', 
            fontSize: '14px',
            borderRadius: 1,
            minHeight: '100px'
          }}
        >
          {error && <span style={{ color: '#ff6b6b' }}>Error: {error}</span>}
          {stdout && (
            <>
              <div>Status: {status.description}</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{stdout}</pre>
            </>
          )}
        </Box>
        <Box 
          sx={{ 
            width: '50%',
            bgcolor: '#000000', 
            padding: '16px', 
            fontSize: '14px',
            borderRadius: 1,
            minHeight: '100px'
          }}
        >
          {stderr && (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
              {stderr}
            </pre>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CodeEditor;