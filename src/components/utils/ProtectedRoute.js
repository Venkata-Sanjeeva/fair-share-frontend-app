import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('fs_user');
    
    // If no user in localStorage, redirect to home/login
    if (!isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;