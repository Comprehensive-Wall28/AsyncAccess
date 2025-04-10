const express = require('express');
const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking
} = require('../controllers/bookingController');

// Create new booking
router.post('/bookings', createBooking);

// Get current user's bookings
router.get('/bookings', getMyBookings);

// Get single booking
router.get('/bookings/:id', getBooking);

// Cancel booking
router.delete('/bookings/:id', cancelBooking);

module.exports = router;