import { apiClient } from './authService'; // Assuming apiClient is exported from authService.js

/**
 * Fetches the current logged-in user's profile information.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    // We don't handle the redirect here anymore; it will be handled in the component.
    throw error;
  }
};

/**
 * Updates the current logged-in user's profile information.
 * @param {Object} profileData - The data to update. Can include name, age, and profilePictureFile.
 * @param {string} [profileData.name] - The new name.
 * @param {number} [profileData.age] - The new age.
 * @param {File} [profileData.profilePictureFile] - The new profile picture file.
 * @param {null} [profileData.profilePicture] - Set to null to clear the profile picture.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const updateUserProfile = async (profileData) => {
  const formData = new FormData();

  if (profileData.name !== undefined) {
    formData.append('name', profileData.name);
  }
  if (profileData.age !== undefined) {
    formData.append('age', profileData.age);
  }
  if (profileData.profilePictureFile instanceof File) {
    formData.append('profilePictureFile', profileData.profilePictureFile);
  } else if (profileData.profilePicture === null) {
    // To clear the profile picture, send 'profilePicture' as an empty string or handle as per backend.
    // The backend controller userControllers.js checks for req.body.profilePicture === "" or null.
    formData.append('profilePicture', ''); 
  }

  const response = await apiClient.put('/users/profile', formData); // Content-Type will be set to multipart/form-data by browser with FormData
  return response.data;
};

export const getAllUsers = () => apiClient.get('/users');