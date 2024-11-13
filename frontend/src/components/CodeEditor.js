import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Button, MenuItem, Select, TextField, CircularProgress } from '@mui/material';
import useCodeExecution from '../hooks/useCodeExecution';
import { changeLanguage, writeCode } from '../api/collaborationApi';
import { Editor } from "@monaco-editor/react";

const languageOptions = [
  { "language_id": 50, "label": "C" },
  { "language_id": 54, "label": "C++" },
  { "language_id": 51, "label": "C#" },
  { "language_id": 60, "label": "Go" },
  { "language_id": 62, "label": "Java" },
  { "language_id": 63, "label": "JavaScript" },
  { "language_id": 71, "label": "Python" }
];

const languageMap = {
  50: "c",
  54: "cpp",
  51: "csp",
  60: "go",
  62: "java",
  63: "javascript",
  71: "python"
}

const CodeEditor = ({ 
  roomId, 
  code, 
  setCode,
  language, 
  setLanguage, 
  codeRunning,  
  status,
  setStatus,
  stdout,
  setStdout,
  stderr,
  setStderr
}) => {
  const [languageName, setLanguageName] = useState(languageMap[language]);
  
  const {
    loading,
    error,
    submissionToken,
    handleCreateSubmission,
    handleGetSubmissionResult,
  } = useCodeExecution(roomId, setStatus, setStdout, setStderr);

  useEffect(() => {
    // Poll for results when submission token exists
    if (loading && submissionToken) {
      const interval = setInterval(() => {
        handleGetSubmissionResult(submissionToken);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [submissionToken, handleGetSubmissionResult, loading]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setLanguageName(languageMap[event.target.value]);
    changeLanguage(roomId, event.target.value);
  };

  const handleCodeChange = (value) => {
    setCode(value);
    writeCode(roomId, value);
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
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: "0 !important"
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
        
        {loading || codeRunning ? <LoadingButton /> : (
          <Button 
            variant="contained" 
            onClick={handleRun} 
            size="small"
          >
            Run
          </Button>
        )}
      </Toolbar>

      <Box sx={{ display: 'flex', my: 2 }}>
        <Editor 
          height={"60vh"}
          language={languageName}
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize: 14,
            overviewRulerLanes: 0,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
            },
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
        {(error || stdout || status) &&
          <Box 
            sx={{  
              width: '100%',
              bgcolor: '#000000', 
              padding: '16px', 
              fontSize: '14px',
              borderRadius: 1,
              minHeight: '100px'
            }}
          >
            {error && <span style={{ color: '#ff6b6b' }}>Error: {error}</span>}
            {status && (
              <>
                {status.description === "Accepted" && (
                  <div>Status: Executed Successfully</div>
                )}
                {status.description !== "Accepted" && (
                  <div>Status: {status.description}</div>
                )}
                { stdout && <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {stdout}
                </pre> }
              </>
            )}
          </Box>
        }
        {stderr &&
          <Box 
            sx={{ 
              width: '100%',
              bgcolor: '#000000', 
              padding: '16px', 
              fontSize: '14px',
              borderRadius: 1,
              minHeight: '100px'
            }}
          >
          
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
                {stderr}
              </pre>
            
          </Box>
        }
      </Box>
    </Box>
  );
};

export default CodeEditor;