// context/AuthContext.js
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
    // Check for existing token from cookie
    const token = getCookie('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 AuthProvider - Token from cookie:', token ? 'Yes' : 'No');
    console.log('🔍 AuthProvider - User from localStorage:', userData ? 'Yes' : 'No');
    
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
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      
      const { accessToken, user } = res.data.data;
      
      console.log('✅ Login successful!');
      console.log('📝 Token:', accessToken);
      console.log('👤 User:', user);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);
      
      // ✅ SET COOKIE - CRITICAL FOR MIDDLEWARE
      setCookie('token', accessToken, { 
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'lax',
      });
      
      // Verify cookie was set
      const cookieCheck = getCookie('token');
      console.log('🔍 Cookie set?', cookieCheck ? '✅ Yes' : '❌ No');
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // ✅ FORCE NAVIGATION
      window.location.href = '/dashboard';
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { name, email, password }
      );
      
      const { accessToken, user } = res.data.data;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);
      
      // ✅ SET COOKIE
      setCookie('token', accessToken, { 
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome, ${user.name}!`);
      
      // ✅ FORCE NAVIGATION
      window.location.href = '/dashboard';
      
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear everything
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