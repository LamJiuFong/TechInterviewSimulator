import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, verifyUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyUser();
        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [isAuthenticated, verifyUser, navigate]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );;

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
