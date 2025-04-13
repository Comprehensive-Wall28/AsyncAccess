const express = require('express');
const router = express.Router();

const {
    getMyBookings
} = require('../controllers/bookingController');

// Import authentication middleware to protect this route
const authenticate = require('../middleware/authenticationMiddleware.js');

// Protect the route with authentication middleware
router.get('/', authenticate, getMyBookings);

module.exports = router;
