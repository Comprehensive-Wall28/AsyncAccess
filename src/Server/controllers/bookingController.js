// bookingController.js
const Booking = require('../models/booking');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const authority = require('../middleware/authorizationMiddleware');
const authenticate = require('../middleware/authenticationMiddleware');

const bookingController = {
  getMyBookings: async (req, res) => {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res.status(401).json({ error: "Please log in to use this functionality" });
      }

      const bookings = await Booking.find({ user: userId });

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ error: "No bookings found for this user" });
      }

      return res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return res.status(500).json({ error: "Internal Server Error. Check console" });
    }
  },

  createBooking: async (req, res) => {
    try {
      const { eventId, tickets } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!eventId || !tickets) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      if (tickets <= 0) {
        return res.status(400).json({ error: 'Invalid number of tickets' });
      }

      const existingBooking = await Booking.findOne({
        user: userId,
        event: eventId,
        bookingStatus: { $ne: 'Cancelled' }
      });

      if (existingBooking) {
        return res.status(409).json({
          error: 'You already have an active booking for this event.',
          existingBookingId: existingBooking._id
        });
      }

      // Get event and check availability
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.status !== 'approved') {
        return res.status(400).json({ error: 'Event is not accepting bookings.' });
      }

      const availableTickets = event.totalTickets - event.bookedTickets;
      if (tickets > availableTickets) {
        return res.status(400).json({ error: 'Not enough tickets available' });
      }

      // Create booking
      const booking = await Booking.create({
        user: userId,
        event: eventId,
        numberOfTickets: tickets,
        totalPrice: event.ticketPrice * tickets,
        bookingDate: new Date(),
        bookingStatus: 'Confirmed'
      });

      // Update event tickets
      event.bookedTickets += tickets;
      await event.save();

      res.status(201).json(booking);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid booking ID' });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json(booking);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid booking ID' });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Authorization check
      if (booking.user.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Cannot cancel another user\'s booking' });
      }

      // Update event tickets
      const event = await Event.findById(booking.event);
      if (event) {
        event.bookedTickets -= booking.numberOfTickets;
        await event.save();
      }

      booking.bookingStatus = 'Cancelled';
      await booking.save();

      res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = bookingController;
