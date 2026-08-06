import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import userService from '../services/user.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const res = await userService.updateProfile(profileData);
    setUser(res.data);
    return res;
  };

  const changePassword = async (passwordData) => {
    return await userService.changePassword(passwordData);
  };

  const deleteAccount = async () => {
    await userService.deleteAccount();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
