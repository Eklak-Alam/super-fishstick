import api from '@/lib/axios';

export const authService = {
  // Login User
  async login(credentials) {
    // We expect { email, password }
    const response = await api.post('/auth/login', credentials);
    
    if (response.data?.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  },

  // Register User
  async register(userData) {
    // We expect { fullName, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get Current Profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
};