const Booking = require('../models/booking');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const authority = require('../middleware/authorizationMiddleware');
const authenticate = require('../middleware/authenticationMiddleware');


// Controller to get the current user's bookings
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("ID "+userId)

        if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        // Query bookings that belong to the current user
        const bookings = await Booking.find({ user: userId });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ error: "No bookings found for this user" });
        }

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getMyBookings,
}