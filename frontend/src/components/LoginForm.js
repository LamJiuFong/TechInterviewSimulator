import './component-styles/LoginForm.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import TextField from '@mui/material/TextField';
import { login } from '../api/authApi.js';
import { Eye, EyeOff } from "lucide-react"

const LoginForm = () => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      loginUser(user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2 className='login-form-header'>Welcome to Peerprep!</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <TextField
          required
          id='email'
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin='normal'
          />
      </div>
      <div className='flex password-container'>
        <TextField
          required
          id='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin='normal'
          type={`${showPassword ? '' : 'password'}`}
        />
        {showPassword 
        ? <Eye className="eye-icon" onClick={() => setShowPassword(false)} size={20} /> 
        : <EyeOff className="eye-icon" onClick={() => setShowPassword(true)} size={20} /> 
        }    
      </div> 
      <button type="submit">Login</button>
      <button onClick={handleSignupRedirect}>Don't have an account? Sign up</button>
    </form>
  );
};

export default LoginForm;
