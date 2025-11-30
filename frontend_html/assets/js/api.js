/**
 * File: frontend/assets/js/api.js
 * API Service - Gọi REST APIs từ Backend
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Hàm helper để tạo request headers
function getHeaders() {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Hàm helper để xử lý response
async function handleResponse(response) {
  if (response.status === 401) {
    // Token hết hạn
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
    throw new Error('Phiên đăng nhập đã hết hạn');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Có lỗi xảy ra');
  }
  
  return response.json();
}

// ============================================
// AUTH API
// ============================================
const authAPI = {
  async register(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async login(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
};

// ============================================
// BOOK API
// ============================================
const bookAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getFeatured() {
    const response = await fetch(`${API_BASE_URL}/books/featured`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async search(params) {
    return this.getAll(params);
  }
};

// ============================================
// POST API
// ============================================
const postAPI = {
  async getMyPosts(userID) {
    const response = await fetch(`${API_BASE_URL}/posts/my-posts?userID=${userID}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async create(data, userID) {
    const response = await fetch(`${API_BASE_URL}/posts?userID=${userID}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.ok;
  },

  async markSold(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/mark-sold`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ============================================
// USER API
// ============================================
const userAPI = {
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async updateProfile(id, data) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async changePassword(id, passwords) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(passwords)
    });
    return handleResponse(response);
  }
};

// ============================================
// CATEGORY API
// ============================================
const categoryAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};