/**
 * File: frontend/src/utils/authUtils.js
 * Authentication Utilities
 */

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Lấy thông tin user từ localStorage
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

// Lưu thông tin đăng nhập
export const saveAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Lấy token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Lấy userID
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.userId || user?.userID || null;
};

// Lấy email
export const getUserEmail = () => {
  const user = getCurrentUser();
  return user?.email || null;
};