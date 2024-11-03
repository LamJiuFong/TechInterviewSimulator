import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
