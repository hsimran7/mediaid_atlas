const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Core fetch wrapper
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mediaid_token');
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ══════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
  getDashboard: () => request('/auth/dashboard'),
};

// ══════════════════════════════════════════
// SOLUTIONS
// ══════════════════════════════════════════
export const solutionsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/solutions?${qs}`);
  },
  getById: (id) => request(`/solutions/${id}`),
  getByCondition: (key, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/solutions/by-condition/${key}?${qs}`);
  },
  create: (formData) => request('/solutions', { method: 'POST', body: formData }),
  update: (id, body) => request(`/solutions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/solutions/${id}`, { method: 'DELETE' }),
  like: (id) => request(`/solutions/${id}/like`, { method: 'POST' }),
  save: (id) => request(`/solutions/${id}/save`, { method: 'POST' }),
  comment: (id, text) => request(`/solutions/${id}/comment`, { method: 'POST', body: JSON.stringify({ text }) }),
  review: (id, body) => request(`/solutions/${id}/review`, { method: 'PATCH', body: JSON.stringify(body) }),
  getPending: () => request('/solutions/admin/pending'),
  getStats: () => request('/solutions/stats/overview'),
};

// ══════════════════════════════════════════
// USERS (Admin)
// ══════════════════════════════════════════
export const usersAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users?${qs}`);
  },
  getById: (id) => request(`/users/${id}`),
  updateRole: (id, role) => request(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  toggleActive: (id) => request(`/users/${id}/toggle-active`, { method: 'PATCH' }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getStats: () => request('/users/stats/overview'),
};
