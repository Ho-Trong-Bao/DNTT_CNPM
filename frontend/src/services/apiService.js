/**
 * File: frontend/src/services/apiService.js
 * API Service - Gọi REST APIs từ Backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Thêm token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
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
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// ============================================
// BOOK APIs
// ============================================
export const bookAPI = {
  // Lấy danh sách sách với filter
  getAll: (params) => apiClient.get('/books', { params }),
  
  // Lấy chi tiết sách
  getById: (id) => apiClient.get(`/books/${id}`),
  
  // Tạo sách mới
  create: (data) => apiClient.post('/books', data),
  
  // Cập nhật sách
  update: (id, data) => apiClient.put(`/books/${id}`, data),
  
  // Xóa sách
  delete: (id) => apiClient.delete(`/books/${id}`),
  
  // Lấy sách nổi bật
  getFeatured: () => apiClient.get('/books/featured'),
  
  // Lấy sách của user
  getByUser: (userID) => apiClient.get(`/books/user/${userID}`),
  
  // Tìm kiếm sách
  search: (searchParams) => apiClient.get('/books', { params: searchParams }),
};

// ============================================
// POST APIs
// ============================================
export const postAPI = {
  // Lấy bài đăng của tôi
  getMyPosts: (userID) => apiClient.get('/posts/my-posts', { params: { userID } }),
  
  // Tạo bài đăng mới
  create: (data, userID) => apiClient.post('/posts', data, { params: { userID } }),
  
  // Cập nhật bài đăng
  update: (id, data) => apiClient.put(`/posts/${id}`, data),
  
  // Xóa bài đăng
  delete: (id) => apiClient.delete(`/posts/${id}`),
  
  // Lấy chi tiết bài đăng
  getById: (id) => apiClient.get(`/posts/${id}`),
  
  // Lấy bài đăng approved
  getApproved: (params) => apiClient.get('/posts/approved', { params }),
  
  // Admin duyệt bài
  approve: (id) => apiClient.put(`/posts/${id}/approve`),
  
  // Admin từ chối bài
  decline: (id) => apiClient.put(`/posts/${id}/decline`),
  
  // Đánh dấu đã bán
  markSold: (id) => apiClient.put(`/posts/${id}/mark-sold`),
};

// ============================================
// USER APIs
// ============================================
export const userAPI = {
  // Lấy thông tin user
  getById: (id) => apiClient.get(`/users/${id}`),
  
  // Lấy profile hiện tại
  getProfile: (email) => apiClient.get('/users/profile', { params: { email } }),
  
  // Cập nhật profile
  updateProfile: (id, data) => apiClient.put(`/users/${id}`, data),
  
  // Đổi mật khẩu
  changePassword: (id, passwords) => apiClient.post(`/users/${id}/change-password`, passwords),
  
  // Lấy tất cả users (Admin)
  getAll: () => apiClient.get('/users'),
  
  // Xóa user (Admin)
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// ============================================
// CATEGORY APIs
// ============================================
export const categoryAPI = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

export default apiClient;