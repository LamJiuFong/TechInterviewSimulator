import { createContext, useContext, useState, useEffect } from "react";
import { setToken, removeToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loginUser = (res) => {
        const user = {
            id: res.data.id,
            isAdmin: res.data.isAdmin,
            username: res.data.username,
        }
        const token = res.data.accessToken;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setLoading(false);
    }

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeToken();
        setLoading(false);
    };

    // To be called upon page refresh
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loginUser,
            logoutUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);