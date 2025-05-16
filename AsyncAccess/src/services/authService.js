import axios from 'axios';

const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClientInstance = axios.create({
  baseURL: BACKEND_STATIC_BASE_URL,
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await apiClientInstance.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed due to a network or server error.');
  }
};

export const logout = async () => {
  try {
    const response = await apiClientInstance.post('/users/logout'); // Use POST for logout
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Logout failed due to a network or server error.');
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


export const updateUserProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePictureFile', file); // 'profilePictureFile' is the field name backend (multer) will expect

    const response = await apiClientInstance.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Should return { user: updatedUser, msg: "..." }
  } catch (error) {
    throw error.response ? error.response.data : new Error('Profile picture upload failed due to a network or server error.');
  }
};

export { apiClientInstance as apiClient };

export default {
  logout,
  login,
  requestPasswordReset,
  signup, 
  updateUserProfilePicture,
};
