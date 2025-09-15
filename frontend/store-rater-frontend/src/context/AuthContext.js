import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // 👈 Import the decoder

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // 👈 New state to hold user data (id, role)

  useEffect(() => {
    // When the token changes, decode it to get user info
    try {
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        localStorage.setItem('token', token);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      // If token is invalid
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const authContextValue = {
    token,
    user, // 👈 Expose the user object
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};

