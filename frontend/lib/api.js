// frontend/lib/api.js
import axios from 'axios';

// ✅ Use environment variable
const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  create: (formData) => api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/properties/${id}`),
  getMy: () => api.get('/properties/my'),
  search: (params) => api.get('/properties/search', { params }),
  getSimilar: (id) => api.get(`/properties/${id}/similar`),
};

export const inquiryAPI = {
  createPublic: (data) => api.post('/inquiries', data),
  getByProperty: (propertyId) => api.get(`/inquiries/${propertyId}`),
};

export default api;