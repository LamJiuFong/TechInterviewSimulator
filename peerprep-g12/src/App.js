import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupPage from "./pages/SignupPage";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/home" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={ "/home" } />} />
      </Routes>
    </Router>
  );
};

export default App;
