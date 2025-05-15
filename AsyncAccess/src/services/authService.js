// src/services/authService.js
import axios from 'axios';

const API_BASE_URL ='http://localhost:5173/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed due to a network or server error.');
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.put('/forgetPassword', { email });
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password reset request failed due to a network or server error.');
  }
};

// You can add other auth-related API calls here, e.g., register, logout, resetPassword

export default {
  login,
  requestPasswordReset,
};
