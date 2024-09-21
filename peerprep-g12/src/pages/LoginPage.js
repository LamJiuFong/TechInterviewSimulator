import LoginForm from "../components/LoginForm";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
      <button onClick={handleSignupRedirect}>Don't have an account? Sign up</button>
    </div>
  );
};

export default LoginPage;
