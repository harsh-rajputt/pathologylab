/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const AppContext = createContext();

// 2. Create the Provider Component
export function AppProvider({ children }) {
    // Global State Examples
    const [user, setUser] = useState(null); // Useful for Auth/Login
    const [theme, setTheme] = useState('light'); // Useful for UI theming
    const [globalLoading, setGlobalLoading] = useState(false); // Useful for full-page loading indicators
    const [globalNotification, setGlobalNotification] = useState(null); // Useful for global toast alerts

    // Fetch initial global data on app load
    useEffect(() => {
        // Example: Check if a user session exists in local storage
        const storedUser = localStorage.getItem('lab_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Helper functions you can call from any component
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('lab_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lab_user');
    };

    const showNotification = (message, type = 'success') => {
        setGlobalNotification({ message, type });
        setTimeout(() => setGlobalNotification(null), 4000);
    };

    // The literal object containing all states and functions you want globally accessible
    const value = {
        user,
        login,
        logout,
        theme,
        setTheme,
        globalLoading,
        setGlobalLoading,
        globalNotification,
        showNotification
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            
            {/* Optional: Render a global notification overlay automatically if it exists */}
            {globalNotification && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium transition-all ${globalNotification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                    {globalNotification.message}
                </div>
            )}
        </AppContext.Provider>
    );
}

// 3. Create a Custom Hook so you don't have to import the Context object everywhere
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
