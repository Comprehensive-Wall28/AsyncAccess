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
 * Fetches event analytics data for the currently logged-in organizer.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of event analytics objects.
 * @throws Will throw an error if the request fails.
 */
export const getEventAnalyticsData = async () => {
    try {
        const response = await apiClient.get('/users/events/analytics');
        return response.data; // Axios automatically parses JSON
    } catch (error) {
        console.error("Error fetching event analytics:", error.response || error.message);
        throw error.response || new Error('Fetching event analytics failed due to a network or server error.');
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
 * Updates an existing event.
 * @param {string} eventId - The ID of the event to update.
 * @param {Object} eventData - The data to update the event with (e.g., { location, totalTickets, date }).
 * @returns {Promise<Object>} A promise that resolves to the updated event object.
 * @throws Will throw an error if the request fails.
 */
export const updateEventById = async (eventId, eventData) => {
    try {
        // The backend expects fields like location, totalTickets, date for organizer updates.
        const response = await apiClient.put(`/events/${eventId}`, eventData);
        return response.data; // Assuming backend returns { status: 'success', data: { event: updatedEvent } }
    } catch (error) {
        throw error.response || new Error('Event update failed due to a network or server error.');
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

/**
 * Fetches all events for admin view (pending, approved, etc.).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of event objects.
 * @throws Will throw an error if the request fails.
 */
export const getAllEventsForAdmin = async () => {
    try {
        // Assuming '/events/all' is the admin endpoint that uses eventController.getAllEventsAdmin
        const response = await apiClient.get('/events/all'); 
        return response.data;
    } catch (error) {
        throw error.response || new Error('Fetching all events for admin failed due to a network or server error.');
    }
};

/**
 * Admin updates an event by its ID. Can update status and other event details.
 * @param {string} eventId - The ID of the event to update.
 * @param {Object} eventData - The data to update the event with (e.g., { title, location, status }).
 * @returns {Promise<Object>} A promise that resolves to the server's response (e.g., the updated event).
 * @throws Will throw an error if the request fails.
 */
export const adminUpdateEventById = async (eventId, eventData) => {
    try {
        // This endpoint should be capable of handling partial updates including status.
        const response = await apiClient.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        throw error.response || new Error('Event update by admin failed due to a network or server error.');
    }
};