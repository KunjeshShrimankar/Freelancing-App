import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [tokens, setTokens] = useState(() => {
    const stored = localStorage.getItem('tokens');
    return stored ? JSON.parse(stored) : null;
  });

  // --- Axios instance with interceptors for token refresh ---
  const axiosAuth = axios.create();

  useEffect(() => {
    // Add interceptor only once
    const interceptor = axiosAuth.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          tokens && tokens.refresh
        ) {
          originalRequest._retry = true;
          try {
            const res = await axios.post('http://localhost:8000/api/users/token/refresh/', {
              refresh: tokens.refresh
            });
            const newTokens = {
              access: res.data.access,
              refresh: tokens.refresh
            };
            setTokens(newTokens);
            localStorage.setItem('tokens', JSON.stringify(newTokens));
            // Update Authorization header and retry original request
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
            return axiosAuth(originalRequest);
          } catch (refreshError) {
            // Refresh failed, log out user
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axiosAuth.interceptors.response.eject(interceptor);
  }, [tokens]);

  useEffect(() => {
    if (tokens) {
      // Fetch user profile
      axiosAuth.get('http://localhost:8000/api/users/profile/', {
        headers: { Authorization: `Bearer ${tokens.access}` },
      })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [tokens]);

  const login = (tokens, user) => {
    setTokens(tokens);
    setUser(user);
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('user', JSON.stringify(user)); // persist user
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('tokens');
    localStorage.removeItem('user'); // remove user
  };

  // Export axiosAuth for authenticated requests
  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, axiosAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 