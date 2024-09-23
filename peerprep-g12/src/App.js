import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import AdminQuestionView from "./pages/AdminQuestionView";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={ "/home" } />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute><AdminQuestionView /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
