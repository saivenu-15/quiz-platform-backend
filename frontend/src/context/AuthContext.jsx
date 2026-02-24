import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, try to restore session
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get('/api/auth/profile');
                setUser(data.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const register = async (name, email, password) => {
        const { data } = await api.post('/api/auth/register', { name, email, password });
        setUser(data.data);
        return data;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        setUser(data.data);
        return data;
    };

    const logout = async () => {
        try { await api.post('/api/auth/logout'); } catch (e) { }
        setUser(null);
    };

    const mockLogin = () => {
        const demoUser = { name: 'Demo User', email: 'demo@example.com' };
        setUser(demoUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, mockLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export default api;
