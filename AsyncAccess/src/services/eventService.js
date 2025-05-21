import { apiClient } from './authService'; // Assuming apiClient is exported from authService.js

/**
 * Fetches the bookings for the currently logged-in user.
 * The backend endpoint should handle user identification via session/token.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of booking objects.
 * @throws Will throw an error if the request fails, including the response object for handling.
 */
export const getMyEvents = async () => {
    try {
        const response = await apiClient.get('/users/events'); // Matches typical route for getMyBookings in controller
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        throw error.response || new Error('Fetching bookings failed due to a network or server error.');
    }
};