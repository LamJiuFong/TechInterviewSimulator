import './page-styles/LoginPage.css';
import LoginForm from "../components/LoginForm";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

const LoginPage = () => {

  return (
    <Box sx={{ padding: 5 }} className="login-container">
      <Grid container spacing={2} alignItems="center" justifyContent="center" className="login-grid">
        <Grid item size={7}>
          <Box className="peerprep-title">
            <h1>Peerprep</h1>
            <p>Practice together, succeed together</p>
          </Box>
        </Grid>
        <Grid item size={5}>
          <Box className="login-form-container">
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
