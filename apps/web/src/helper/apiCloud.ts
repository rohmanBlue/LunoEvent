// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
 //   baseURL: 'http://localhost:8000/',
  baseURL: 'http://134.199.195.231:8000', // Your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;


