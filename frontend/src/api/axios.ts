// src/api/axios.ts
import axios from 'axios';

function getBaseURL(): string {
  // 1) Si el usuario definió VITE_API_URL (p. ej. "http://host:3000/api"), lo usamos tal cual
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, ''); // quita slash final
  }

  // 2) Si no, construimos a partir de dónde sirve la UI
  const { protocol, hostname } = window.location;
  const backendPort = '3000';
  return `${protocol}//${hostname}:${backendPort}`;
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para adjuntar el JWT si existe
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
