import { apiClient } from './authService'; // Assuming apiClient is exported from authService.js

/**
 * Fetches the bookings for the currently logged-in user.
 * The backend endpoint should handle user identification via session/token.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of booking objects.
 * @throws Will throw an error if the request fails, including the response object for handling.
 */
export const getMyBookings = async () => {
    try {
        const response = await apiClient.get('/users/bookings'); // Matches typical route for getMyBookings in controller
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        throw error.response || new Error('Fetching bookings failed due to a network or server error.');
    }
};

export const cancelBookingById = async (bookingId) => {
    try {
        // The backend route is PATCH /api/v1/bookings/:id
        const response = await apiClientInstance.delete(`/bookings/${bookingId}`);
        return response.data; // Expected: { message: '...', booking: updatedBooking }
    } catch (error) {
        throw error.response ? { data: error.response.data, status: error.response.status } : new Error('Booking cancellation failed.');
    }
};