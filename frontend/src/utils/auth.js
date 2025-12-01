/**
 * File: frontend/src/utils/auth.js
 * Authentication Utilities
 */

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const saveAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const getUserId = () => {
  const user = getCurrentUser();
  return user?.userId || user?.userID || null;
};

export const getUserEmail = () => {
  const user = getCurrentUser();
  return user?.email || null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'ADMIN' || user?.email?.includes('admin');
};