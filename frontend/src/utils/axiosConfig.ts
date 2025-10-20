import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add access token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        if (refreshResponse.status === 200 && refreshResponse.data.accessToken) {
          // Store new access token
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

