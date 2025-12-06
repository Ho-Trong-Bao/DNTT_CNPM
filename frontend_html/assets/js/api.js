// API client rebuilt per your backend API document
// Save token under localStorage key 'authToken' and user info under 'user'

const API_BASE_URL = 'http://localhost:8080/api';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

function saveAuth(token, user) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

function getHeaders(isJson = true) {
  const token = getAuthToken();
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(response) {
  if (response.status === 401) {
    clearAuth();
    // don't redirect automatically here; let caller handle
    throw new Error('401 Unauthorized');
  }
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    const message = json.message || json.error || 'Request failed';
    const err = new Error(message);
    err.status = response.status;
    err.payload = json;
    throw err;
  }
  // If response has no body (204), return null
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ------------------ AUTH ------------------
const authAPI = {
  async register(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async login(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    // normalize: backend returns userID (camelCase UserID in docs) and role
    const token = data.token;
    const user = {
      userID: data.userID ?? data.userId ?? data.user?.userID ?? null,
      name: data.name,
      email: data.email,
      role: data.role
    };
    saveAuth(token, user);
    return data;
  },

  async adminLogin(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    const token = data.token;
    const user = {
      userID: data.userID,
      name: data.name,
      email: data.email,
      role: data.role
    };
    saveAuth(token, user);
    return data;
  },

  logout() {
    clearAuth();
  }
};

// ------------------ BOOKS ------------------
const bookAPI = {
  async list(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/books${qs ? `?${qs}` : ''}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async get(bookID) {
    const res = await fetch(`${API_BASE_URL}/books/${bookID}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async search(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/books/search?${qs}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async byProvince(province) {
    const res = await fetch(`${API_BASE_URL}/books/province/${encodeURIComponent(province)}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async featured() {
    const res = await fetch(`${API_BASE_URL}/books/featured`, { headers: getHeaders() });
    return handleResponse(res);
  }
};

// ------------------ POSTS ------------------
const postAPI = {
  
  // Tạo bài đăng mới
  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Lấy bài của tôi
  getMyPosts: async () => {
    return request.get("/my-posts");
  },

  // Xóa bài đăng
  delete: async (postID) => {
    return request.delete(`/posts/${postID}`);
  }
};


// ------------------ MY POSTS (user) ------------------
const myPostAPI = {
  async list() {
    const res = await fetch(`${API_BASE_URL}/my-posts`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async create(payload) {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(postID, payload) {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(postID) {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async markSold(postID) {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}/sold`, {
      method: 'PUT',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  }
};

// ------------------ IMAGE ------------------
const imageAPI = {
  async upload(file) {
    const fd = new FormData(); fd.append('file', file);
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd
    });
    return handleResponse(res);
  },

  async uploadMultiple(filesArray) {
    const fd = new FormData();
    filesArray.forEach(f => fd.append('files', f));
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/images/upload-multiple`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd
    });
    return handleResponse(res);
  },

  async delete(fileName) {
    const res = await fetch(`${API_BASE_URL}/images/${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  // public image URL: `${API_BASE_URL.replace('/api','')}/images/{fileName}` or `${API_BASE_URL}/images/{fileName}` depending on backend routing
  getPublicUrl(fileName) {
    return `${API_BASE_URL}/images/${fileName}`;
  }
};

// ------------------ CATEGORIES ------------------
const categoryAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
    return handleResponse(res);
  }
};

// ------------------ USER (admin) ------------------
const adminAPI = {
  async getAllPosts() {
    const res = await fetch(`${API_BASE_URL}/admin/posts`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async getPostsByStatus(status) {
    const res = await fetch(`${API_BASE_URL}/admin/posts/status/${encodeURIComponent(status)}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async updatePostStatus(postID, payload) {
    const res = await fetch(`${API_BASE_URL}/admin/posts/${postID}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async listUsers() {
    const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async updateUserStatus(userID, payload) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userID}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteUser(userID) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userID}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async createCategory(payload) {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async updateCategory(categoryID, payload) {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryID}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteCategory(categoryID) {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryID}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  }
};

// ------------------ EXPORT ------------------
window.api = {
  authAPI,
  bookAPI,
  postAPI,
  myPostAPI,
  imageAPI,
  categoryAPI,
  userAPI: {
    getById: async (id) => fetch(`${API_BASE_URL}/users/${id}`, { headers: getHeaders() }).then(handleResponse),
    update: async (id, payload) => fetch(`${API_BASE_URL}/users/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(payload) }).then(handleResponse),
    changePassword: async (id, payload) => fetch(`${API_BASE_URL}/users/${id}/change-password`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) }).then(handleResponse)
  },
  categoryAPI,
  adminAPI
};

// Usage note: this file matches the API document provided. If backend property names differ (userID vs userId)
// the authAPI.login normalizes userID. Make sure the frontend uses localStorage key 'authToken' and 'user'.
