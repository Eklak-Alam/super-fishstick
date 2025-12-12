import api from '@/lib/axios';

export const authService = {
  // Login & Save Tokens
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  // Register
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get Profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout (Wipes everything)
  logout() {
    // 1. Remove from LocalStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // 2. Redirect manually to ensure full page reset
    window.location.href = '/login';
  }
};