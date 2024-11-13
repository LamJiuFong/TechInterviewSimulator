import { createContext, useContext, useState, useEffect } from "react";
import { setToken, removeToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }
    , [user]);

    const loginUser = (res) => {
        const user = {
            id: res.data.id,
            isAdmin: res.data.isAdmin,
            email: res.data.email,
            username: res.data.username,
        }
        console.log(user)
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