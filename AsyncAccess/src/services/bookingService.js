import { apiClient } from './authService'; // Assuming apiClient is exported from authService.js
/**
 * Fetches the bookings for the currently logged-in user.
 * The backend endpoint should handle user identification via session/token.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of booking objects.
 * @throws Will throw an error if the request fails, including the response object for handling.
 */
 export const getMyBookings = async () => {
    try {
        const response = await apiClient.get('/users/bookings');
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        // Re-throw error for component to handle, including potential redirects
        throw error; 
    }
};

export const cancelBookingById = async (bookingId) => {    
    try {
        const response = await apiClient.delete(`/bookings/${bookingId}`);
        return response.data; // Expected: { message: '...', booking: updatedBooking }
    } catch (error) {
        // Re-throw error for component to handle, including potential redirects
        throw error; 
    }
};