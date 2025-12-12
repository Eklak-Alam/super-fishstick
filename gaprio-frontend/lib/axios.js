import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. Request Interceptor: Attach Token ---
api.interceptors.request.use(
  (config) => {
    // We use localStorage because your backend sends JSON, not HttpOnly cookies.
    // If you want cookies, we can use 'js-cookie', but localStorage is standard for this flow.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. Response Interceptor: Auto-Refresh Logic ---
api.interceptors.response.use(
  (response) => response, // Return successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried so we don't loop forever

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Call your backend's refresh endpoint
        // We use a clean axios instance to avoid infinite loops with interceptors
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`, {
            refreshToken
        });

        const { accessToken } = response.data.data;

        // 1. Save the new token
        localStorage.setItem('accessToken', accessToken);

        // 2. Update the header for the failed request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 3. Retry the original request with the new token
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails (token expired or invalid), Force Logout
        console.error("Session expired. Logging out...");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;