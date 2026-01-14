import axios from 'axios';
import { getCurrentUser } from './authService';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const user = getCurrentUser();
    if (user) {
      try {
        // Get the Firebase ID token
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// User API methods
export const userAPI = {
  /**
   * Get current user's profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update current user's profile
   * @param {Object} userData - User data to update
   */
  updateUser: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },

  /**
   * Sync Firebase Auth user with Firestore
   * @param {Object} userData - Additional user data
   */
  syncUser: async (userData = {}) => {
    const response = await apiClient.post('/users/sync', userData);
    return response.data;
  },

  /**
   * Get user by UID
   * @param {string} uid - User UID
   */
  getUser: async (uid) => {
    const response = await apiClient.get(`/users/${uid}`);
    return response.data;
  },
};

// Appointment API methods
export const appointmentAPI = {
  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   */
  createAppointment: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  /**
   * Get all appointments for current user
   */
  getAppointments: async () => {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  /**
   * Get appointment by ID
   * @param {string} id - Appointment ID
   */
  getAppointment: async (id) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Update appointment
   * @param {string} id - Appointment ID
   * @param {Object} updateData - Data to update
   */
  updateAppointment: async (id, updateData) => {
    const response = await apiClient.put(`/appointments/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete appointment
   * @param {string} id - Appointment ID
   */
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default apiClient;
