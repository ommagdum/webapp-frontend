import { api } from './api';

const adminService = {
  getUsers: (page = 0, size = 10) => {
    return api.get(`/api/admin/users?page=${page}&size=${size}`);
  },

  registerAdmin: async (email, password, secret) => {
    try {
      const response = await api.post('/api/admin/register-admin',
        { email, password },
        {
          headers: {
            'X-Admin-Secret': secret
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserRole: (userId, role) => 
    api.put(`/api/admin/users/${userId}/role`, { role }) // Changed from patch to put
    .then(response => response.data)
    .catch(error => {
      throw error.response?.data || error;
    }),

  getSystemStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  }
};

export { adminService };
