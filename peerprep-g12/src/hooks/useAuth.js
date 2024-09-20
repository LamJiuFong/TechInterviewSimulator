import { useState, useEffect } from "react";
import { login, verifyToken } from "../api/authApi";
import { getToken, setToken, removeToken } from "../utils/token";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = async (email, password) => {
    const { data } = await login(email, password);
    setToken(data.accessToken);
    setIsAuthenticated(true);
  };

  const verifyUser = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    await verifyToken(token);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loginUser, verifyUser, logoutUser };
};
