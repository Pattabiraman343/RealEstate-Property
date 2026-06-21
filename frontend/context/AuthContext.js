// frontend/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getCookie('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 AuthProvider - Token:', token ? 'Yes' : 'No');
    console.log('🔍 AuthProvider - User:', userData ? 'Yes' : 'No');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ User restored:', parsedUser.name);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        deleteCookie('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://realestate-property-jq22.onrender.com/api';
      
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { accessToken, user } = res.data.data;
      
      console.log('✅ Login successful!');
      
      // Store in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set cookie
      setCookie('token', accessToken, { 
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });
      
      // Set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://realestate-property-jq22.onrender.com/api';
      
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      
      const { accessToken, user } = res.data.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCookie('token', accessToken, { 
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome, ${user.name}!`);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
      
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://realestate-property-jq22.onrender.com/api';
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    deleteCookie('token');
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;