import { createContext, useContext, useState, useEffect } from "react";
import { setToken, removeToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const loginUser = (res) => {
        const user = {
            id: res.data.id,
            isAdmin: res.data.isAdmin
        }
        const token = res.data.accessToken;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
    }

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeToken();
    };

    // To be called upon page refresh
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);
