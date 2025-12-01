/**
 * File: frontend/src/services/api.js
 * API Service - Kết nối Backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ============================================
// BOOK APIs
// ============================================
export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  getFeatured: () => api.get('/books/featured'),
  search: (params) => api.get('/books', { params }),
};

// ============================================
// POST APIs
// ============================================
export const postAPI = {
  getMyPosts: (userID) => api.get('/posts/my-posts', { params: { userID } }),
  create: (data, userID) => api.post('/posts', data, { params: { userID } }),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  markSold: (id) => api.put(`/posts/${id}/mark-sold`),
  getPending: () => api.get('/posts/pending'),
  approve: (id) => api.put(`/posts/${id}/approve`),
  decline: (id) => api.put(`/posts/${id}/decline`),
};

// ============================================
// USER APIs
// ============================================
export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
  getAll: () => api.get('/users'),
  update: (id, data) => api.put(`/users/${id}`, data),
  changePassword: (id, passwords) => api.post(`/users/${id}/change-password`, passwords),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============================================
// CATEGORY APIs
// ============================================
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;