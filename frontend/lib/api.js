// lib/api.js
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Property APIs
export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  
  // ✅ CREATE - Send FormData
  create: (formData) => {
    return api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // ✅ UPDATE - Send FormData
  update: (id, formData) => {
    return api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id) => api.delete(`/properties/${id}`),
  getMy: () => api.get('/properties/my'),
  search: (params) => api.get('/properties/search', { params }),
  getSimilar: (id) => api.get(`/properties/${id}/similar`),
};

// Inquiry APIs
export const inquiryAPI = {
  createPublic: (data) => api.post('/inquiries', data),
  getByProperty: (propertyId) => api.get(`/inquiries/${propertyId}`),
};

export default api;