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
  list: async () => {
    const res = await fetch(`${API_BASE_URL}/books`, { headers: getHeaders() });
    return handleResponse(res);
  },

  get: async (bookID) => {
    const res = await fetch(`${API_BASE_URL}/books/${bookID}`, { headers: getHeaders() });
    return handleResponse(res);
  },


  search: async (params) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/books/search?${qs}`);
    return handleResponse(res);  // backend trả LIST
  },



  byProvince: async (province) => {
    const res = await fetch(`${API_BASE_URL}/books/province/${province}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};


// ------------------ CATEGORIES ------------------
const categoryAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
    return handleResponse(res);
  }
};

// ========================
// POST (USER)
// ========================
const postAPI = {
  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getMyPosts: async () => {
    const res = await fetch(`${API_BASE_URL}/my-posts`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  update: async (postID, payload) => {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  delete: async (postID) => {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}`, {
      method: "DELETE",
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  markSold: async (postID) => {
    const res = await fetch(`${API_BASE_URL}/my-posts/${postID}/sold`, {
      method: "PUT",
      headers: getHeaders(false)
    });
    return handleResponse(res);
  }
};

// ------------------ USER API ------------------
const userAPI = {
  // GET /api/users/{userID}
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // PUT /api/users/{userID}
  updateProfile: async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // POST /api/users/{userID}/change-password
  changePassword: async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  }
};





// ========================
// IMAGE
// ========================
const imageAPI = {
  upload: async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API_BASE_URL}/images/upload`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + getToken() },
      body: fd
    });

    return handleResponse(res);
  },

  delete: async (fileName) => {
    const res = await fetch(`${API_BASE_URL}/images/${fileName}`, {
      method: "DELETE",
      headers: getHeaders(false)
    });
    return handleResponse(res);
  }
};



// ------------------ admin ------------------
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
  imageAPI,
  categoryAPI,
  userAPI,
  adminAPI
};

// Usage note: this file matches the API document provided. If backend property names differ (userID vs userId)
// the authAPI.login normalizes userID. Make sure the frontend uses localStorage key 'authToken' and 'user'.


