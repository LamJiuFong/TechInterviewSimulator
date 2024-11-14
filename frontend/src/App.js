import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import AdminQuestionView from "./pages/AdminQuestionView";
import WaitingRoom from './pages/WaitingRoom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import CollaborationRoom from './pages/CollaborationRoom';
import PageNotFound from './pages/PageNotFound';
import AccountSettingsPage from './pages/AccountSettingsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <div className='App'>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to={ "/login" } />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage/>}/>
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/admin/questions" element={<ProtectedRoute><AdminQuestionView /></ProtectedRoute>} />
              <Route path="/waiting-room" element={<ProtectedRoute><WaitingRoom /></ProtectedRoute>} />
              <Route path="/collaboration" element={<ProtectedRoute><CollaborationRoom/></ProtectedRoute>} />
              <Route path="/setting" element={<ProtectedRoute><AccountSettingsPage/></ProtectedRoute>} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>

  );
};

export default App;
