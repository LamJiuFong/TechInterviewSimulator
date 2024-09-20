import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
