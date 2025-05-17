// src/services/authService.js
import axios from 'axios';

const API_BASE_URL ='http://localhost:3000/api/v1';

// This is the axios instance. It's already named apiClient internally.
const apiClientInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (email, password) => {
  console.log('login called with:', email); // Add this line
  try {
    const response = await apiClientInstance.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error, error?.response?.data);
    throw error.response ? error.response.data : new Error(error?.response);
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClientInstance.put('/forgetPassword', { email });
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : new Error('Password reset request failed due to a network or server error.');
  }
};

export const signup = async (name, email, password, role ) => {
  try{
    const response = await apiClientInstance.post('/register', { name, email, password, role });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Signup failed due to a network or server error.');
  }
}

// Export the configured axios instance for direct use.
// We'll export it with the name 'apiClient' so BookingListing.jsx can use it as such.
export { apiClientInstance as apiClient };

// You can add other auth-related API calls here, e.g., register, logout, resetPassword
export default {
  login,
  requestPasswordReset,
  signup, // Added for consistency
};
