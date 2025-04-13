const Booking = require('../models/booking');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');

const createBooking = async (req, res, next) => {
    try {
        // Get userId from request body instead of req.user
        const { eventId, numberOfTickets, userId } = req.body;

        // to validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({error: 'Valid user ID is required'});
        }
        //to verify that the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({error: 'No such event'});
        }

        if (numberOfTickets > event.totalTickets) {
            return res.status(400).json({error: 'Not enough tickets available'});
        }

        const totalPrice = event.ticketPrice * numberOfTickets;

        const booking = await Booking.create({
            user: userId,
            event: eventId,
            numberOfTickets,
            totalPrice
        });

        event.totalTickets -= numberOfTickets; //to update number of tickets available
        await event.save();

        res.status(201).json(booking);
    } catch (err) {
        next(err);
    }
};


// Controller to get the current user's bookings
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user?.id;

        //if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        // Query bookings that belong to the current user
        const bookings = await Booking.find({userId});

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ error: "No bookings found for this user" });
        }

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getBooking = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such booking' });
    }

    const booking = await Booking.findOne({
        _id: id,
        user: req.user._id  // only find bookings owned by current user
    }).populate('event');

    if (!booking) {
        return res.status(404).json({ error: 'No such booking'});
    }

    res.status(200).json(booking);
};

const cancelBooking = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such booking' });
    }

    const booking = await Booking.findOneAndDelete({
        _id: id,
        user: req.user._id  // only deletes if the booking belongs to requesting user
    });

    if (!booking) {
        return res.status(404).json({ error: 'No such booking' });
    }

    await Event.findByIdAndUpdate(booking.event, {
        $inc: { totalTickets: booking.numberOfTickets }
    });

    res.status(200).json(booking);
};

module.exports = {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking
}