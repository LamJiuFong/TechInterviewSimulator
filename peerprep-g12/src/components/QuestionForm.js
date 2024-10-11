import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useQuestions from '../hooks/useQuestions';

export default function QuestionForm({ open, onClose, isUpdate, questionData = null, update, add }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionCategory, setQuestionCategory] = useState([]);
  const [questionComplexity, setQuestionComplexity] = useState('');
  const [questionLink, setQuestionLink] = useState('');
  const [questionHints, setQuestionHints] = useState(['']);
  const [questionExamples, setQuestionExamples] = useState([{ input: '', output: '' }]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showError, setShowError] = useState(false);
  const { error, categories } = useQuestions();
  const complexities = ['Easy', 'Medium', 'Hard'];


  // useEffect to update form state when questionData changes
  useEffect(() => {
    setErrorMsg(null);
    setShowError(false);
    if (isUpdate && questionData) {
      setQuestionTitle(questionData.title || '');
      setQuestionDescription(questionData.description || '');
      setQuestionCategory(questionData.categories || []);
      setQuestionComplexity(questionData.difficulty); // 0 || '' will return '' (0 is falsy)
      setQuestionLink(questionData.link || '');
      setQuestionHints(questionData.hints || ['']);
      setQuestionExamples(questionData.examples || [{ input: '', output: '' }]);
    } else {
      // Reset form if no question data (for adding new questions)
      setQuestionTitle('');
      setQuestionDescription('');
      setQuestionCategory([]);
      setQuestionComplexity('');
      setQuestionLink('');
      setQuestionHints(['']);
      setQuestionExamples([{ input: '', output: '' }]);
    }
  }, [open, isUpdate, questionData, errorMsg]);

  const handleAddHint = () => {
    setQuestionHints([...questionHints, '']);
  };

  const handleRemoveHint = (index) => {
    const updatedHints = [...questionHints];
    updatedHints.splice(index, 1);
    setQuestionHints(updatedHints);
  };

  const handleHintChange = (index, value) => {
    const updatedHints = [...questionHints];
    updatedHints[index] = value;
    setQuestionHints(updatedHints);
  };

  const handleAddExample = () => {
    setQuestionExamples([...questionExamples, { input: '', output: '' }]);
  };

  const handleRemoveExample = (index) => {
    const updatedExamples = [...questionExamples];
    updatedExamples.splice(index, 1);
    setQuestionExamples(updatedExamples);
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...questionExamples];
    updatedExamples[index][field] = value;
    setQuestionExamples(updatedExamples);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      title: questionTitle,
      description: questionDescription,
      categories: questionCategory,
      difficulty: questionComplexity,
      link: questionLink,
      hints: questionHints,
      examples: questionExamples,
    };

    try {
      if (isUpdate) {
        update(questionData._id, newQuestion);
      } else {
        add(newQuestion);
      }

      onClose(); // Close dialog after submission

    } catch (err) {
      setErrorMsg(err.message || 'Error occured while submitting the form');
    }
  };

  const handleCloseError = () => {
    setShowError(false);  // Hide the error alert when closed
  };

  if (error) {
    return <Alert severity="error">{errorMsg}</Alert>;
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{isUpdate ? 'Update Question' : 'Add Question'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please {isUpdate ? 'update' : 'add'} the question details below
          </DialogContentText>
          {/* Error Alert */}
          {showError && errorMsg && (
            <Alert
              severity="error"
              style={{ marginBottom: '15px' }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleCloseError}  // Dismiss the error
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {errorMsg}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
                required
                id='questionTitle'
                label='Question Title'
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                fullWidth
                margin='normal'
            />
            <TextField
                required
                id='questionDescription'
                label='Question Description'
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
                fullWidth
                margin='normal'
            />
            <FormControl fullWidth margin='normal' required>
              <InputLabel id="questionCategory">Question Category</InputLabel>
              <Select
                  id='questionCategory'
                  label='Question Category'
                  multiple
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}

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

            <TextField
                required
                id='questionComplexity'
                select
                label='Question Complexity'
                value={questionComplexity}
                onChange={(e) => setQuestionComplexity(e.target.value)}
                fullWidth
                margin='normal'
            >
              {complexities.map((complexity) => (
                  <MenuItem key={complexity} value={complexity}>
                    {complexity}
                  </MenuItem>
              ))}
            </TextField>
            <TextField
                required
                id="questionLink"
                label="Question Link"
                value={questionLink}
                onChange={(e) => setQuestionLink(e.target.value)}
                fullWidth
                margin="normal"
            />

            <div style={{marginTop: '10px'}}>
              <InputLabel>Examples</InputLabel>
              {questionExamples.map((example, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'flex-start', marginBottom: '24px'}}>
                    <div style={{flexGrow: 1}}>
                      <TextField
                          required
                          label={`Example ${index + 1} - Input`}
                          value={example.input}
                          onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                          fullWidth
                          margin="normal"
                          placeholder="Input"
                      />
                      <TextField
                          required
                          label={`Example ${index + 1} - Output`}
                          value={example.output}
                          onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                          fullWidth
                          margin="normal"
                          placeholder="Output"
                      />
                    </div>
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveExample(index)}
                        style={{
                          marginLeft: '10px',
                          marginTop: '10px',
                          width: 'auto',
                        }}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </div>
              ))}
              <Button variant="outlined" onClick={handleAddExample} startIcon={<AddIcon/>}>
                Add Example
              </Button>
            </div>

            <div style={{marginTop: '10px'}}>
              <InputLabel>Hints</InputLabel>
              {questionHints.map((hint, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                    <TextField
                        value={hint}
                        onChange={(e) => handleHintChange(index, e.target.value)}
                        fullWidth
                        placeholder={`Hint ${index + 1}`}
                        margin="normal"
                    />
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveHint(index)}
                        style={{marginLeft: '10px', width: 'auto',}}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </div>
              ))}
              <Button variant="outlined" onClick={handleAddHint} startIcon={<AddIcon/>} style={{marginTop: '15px'}}>
                Add Hint
              </Button>
            </div>

            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button type='submit'>
                Submit
              </Button>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
