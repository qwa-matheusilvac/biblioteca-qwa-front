import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://qwalx-02.qwa.brasil:8087';

const resolvedApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '') || DEFAULT_API_BASE_URL;

const apiClient = axios.create({
  baseURL: resolvedApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login or clear token)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
