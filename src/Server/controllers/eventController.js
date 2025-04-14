const Booking = require('../models/booking');
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');

const notFoundResponse = { error: 'No such event' };

const getAllEvents = async (req, res, next) => {
    const events = await Event.find({}).sort({createdAt: -1});
    res.status(200).json(events);
};

const getEventAnalytics = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json(notFoundResponse);
    }

    try {
        // Get the total number of bookings for the event
        const bookingsCount = await Booking.aggregate([
            { $match: { eventId: mongoose.Types.ObjectId(id) } },  // Match the event ID
            { $count: 'totalBookings' }  // Count the number of bookings
        ]);

        const event = await Event.findById(id);  // Get event details

        if (!event) {
            return res.status(404).json({ error: 'No such event analytics' });
        }

        const totalBookings = bookingsCount.length > 0 ? bookingsCount[0].totalBookings : 0;

        // Respond with event and its analytics
        res.status(200).json({
            event,
            analytics: {
                totalBookings,
                remainingTickets: event.totalTickets - totalBookings,
                revenueGenerated: event.ticketPrice * totalBookings  // Assuming ticketPrice is per booking
            }
        });
    } catch (err) {
        console.error("Error fetching event analytics:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const createEvent = async (req, res, next) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            image,
            ticketPrice,
            totalTickets,
            organizer,
            createdDate
        } = req.body;

        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            category,
            image,
            ticketPrice,
            totalTickets,
            organizer,
            createdDate,
            status: 'pending' // the event needs to be approved first
        });

        res.status(201).json({newEvent});
    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json(notFoundResponse);
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json(notFoundResponse);
        }

        const allowedUpdates = {};
        if (req.body.totalTickets !== undefined) {
            allowedUpdates.totalTickets = req.body.totalTickets;
        }
        if (req.body.date !== undefined) {
            allowedUpdates.date = req.body.date;
        }
        if (req.body.location !== undefined) {
            allowedUpdates.location = req.body.location;
        }

        const updatedEvent = await Event.findOneAndUpdate(
            { _id: id },
            allowedUpdates,
            res.body
        );

        res.status(200).json({
            status: 'success',
            data: {
                event: updatedEvent
            }
        });
    } catch (err) {
        next(err);
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json(notFoundResponse);
    }

    const event = await Event.findById(id);
    if (!event) {
        return res.status(404).json(notFoundResponse);
    }

    const deletedEvent = await Event.findOneAndDelete({ _id: id });

    res.status(200).json(deletedEvent);
};

const getMyEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("ID "+userId)
        const userType = req.user.role;

        if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        if(userType!="Admin"&&userType!="Organizer"){
            return res.status(401).json({ error: "User must be Organizer or higher" });
            console.log("Need to use proper role ya basha")
        }

        const events = await Event.find({userId});

        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found for this user" });
        }

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user events:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



/*const getEventAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("ID "+userId)
        const userType = req.user.role;

        if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        if(userType!="Admin"&&userType!="Organizer"){
            return res.status(401).json({ error: "User must be Organizer or higher" });
            console.log("Need to use proper role ya basha")
        }

        const events = await Event.find({userId});

        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found for this user" });
        }

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user events:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};*/

const approveEvent = async (req, res, next) => {     //not tested
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json(notFoundResponse);
        }

        if(event.status === 'approved') {
            return res.status(400).json({message: 'Event already approved'});
        }
        if (!['approved', 'declined'].includes(req.body.status)) {
            return res.status(400).json({message: 'Status must be either "approved" or "declined"'});
        }

        event.status = req.body.status;
        await event.save();

        // Success response
        res.status(200).json({
            status: 'success',
            data: {
                event
            }
        });
    } catch (err) {

        next(err);
    }
};

module.exports = {
    getMyEvents,
    getEventAnalytics,
}