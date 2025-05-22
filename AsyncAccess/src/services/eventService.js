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

/**
 * Creates a new event.
 * @param {Object} eventData - The data for the event to be created.
 * @returns {Promise<Object>} A promise that resolves to the created event object.
 * @throws Will throw an error if the request fails.
 */
export const createEvent = async (eventData) => {
    try {
        const response = await apiClient.post('/events', eventData); // Matches POST /events route
        return response.data;
    } catch (error) {
        throw error.response || new Error('Event creation failed due to a network or server error.');
    }
};

/**
 * Cancels an event (e.g., updates its status to 'Cancelled').
 * @param {string} eventId - The ID of the event to cancel.
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., the updated event).
 * @throws Will throw an error if the request fails.
 */
export const cancelEventById = async (eventId) => {
    try {
        // Assuming a PUT/PATCH request to an endpoint like /events/:id/cancel or just /events/:id with a status update
        // For this example, let's assume it's a PUT request to change status.
        // Adjust the endpoint and method as per your backend implementation for cancelling.
        const response = await apiClient.put(`/events/${eventId}/cancel`); // Example endpoint
        return response.data;
    } catch (error) {
        throw error.response || new Error('Event cancellation failed due to a network or server error.');
    }
};

/**
 * Deletes an event permanently.
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., a success message).
 * @throws Will throw an error if the request fails.
 */
export const deleteEventById = async (eventId) => {
    try {
        const response = await apiClient.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response || new Error('Event deletion failed due to a network or server error.');
    }
};