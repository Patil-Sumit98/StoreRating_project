import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  // If user is not logged in OR their role is not in the allowed list, redirect to login
  if (!user || !roles.includes(user.role)) {
    // You can also redirect to a custom "Unauthorized" page
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated and has the correct role, render the page
  return children;
};

export default ProtectedRoute;
