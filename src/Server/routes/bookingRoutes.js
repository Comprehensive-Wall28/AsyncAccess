const express = require('express');
const router = express.Router();

const {
    getMyBookings
} = require('../controllers/bookingController');

const authenticate = require('../middleware/authenticationMiddleware.js');

//Get all bookings
router.get('/',authenticate, getMyBookings);

module.exports = router;