import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setTokens, setLogoutCallback, getRefreshToken } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    
    // Setup logout callback for axios interceptor
    useEffect(() => {
        setLogoutCallback(() => {
            setUser(null);
            setTenant(null);
            setTokens(null, null);
        });
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login/', { email, password });
        const { access, refresh, user: userData, tenant: tenantData } = response.data;
        
        setTokens(access, refresh);
        setUser(userData);
        setTenant(tenantData);
        
        return response.data;
    };

    const signup = async (data) => {
        const response = await api.post('/auth/signup/', data);
        const { access, refresh, user: userData, tenant: tenantData } = response.data;
        
        setTokens(access, refresh);
        setUser(userData);
        setTenant(tenantData);
        
        return response.data;
    };

    const logout = async () => {
        try {
            const refresh = getRefreshToken();
            if (refresh) {
                await api.post('/auth/logout/', { refresh });
            }
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            setTenant(null);
            setTokens(null, null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, tenant, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
