import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { getToken } from "../utils/token";
import { verifyToken } from "../api/authApi";

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();

    verifyToken(storedToken)
    .then((res) => {
        const user = {
            id: res.data.id,
            isAdmin: res.data.isAdmin,
            username: res.data.username,
            email: res.data.email
        }
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setLoading(false);
    })
    .catch((err) => {
      navigate("/login");
      setLoading(false);
    })
  }, [setUser, navigate]);

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
