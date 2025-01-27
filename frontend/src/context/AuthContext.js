import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../config/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        }
    }, []); // No dependencies needed as it only uses external values

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchUserData();
        }
        setLoading(false);
    }, [fetchUserData]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during login' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password
            });
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred during registration' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
