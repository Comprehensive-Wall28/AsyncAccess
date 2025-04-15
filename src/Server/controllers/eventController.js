const Event = require('../models/event');

const mongoose = require("mongoose");

const getMyEvents = async (req, res) => {
    const { id } = req.params;  // Get the ID from the request parameters
    console.log("Received event ID:", id);  // Log the ID to check its format

    //if (!mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({ error: 'Invalid event ID' });}

    const userId = req.user.userId;
    const userType = req.user.role;

    if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

    if (userType !== "Organizer"&&userType!=="Admin") {return res.status(403).json({ error: "User must be an Organizer" });}

    try {
        // Get all events for the logged-in user
        const events = await Event.find({
            $or: [
                { userId: userId }, // in case it's saved as a string
                { userId: new mongoose.Types.ObjectId(userId) } // correct usage with 'new'
            ]
        }).select('title');

        if (!events || events.length === 0) {
            return res.status(404).json({ error: "No events found for this user" });
        }

        return res.status(200).json(events);  // Return the events with only the selected fields
    } catch (error) {
        console.error("Error fetching user events:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getEventAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userType = req.user.role;

        if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        if (userType !== "Admin" && userType !== "Organizer") {return res.status(403).json({ error: "User must be Organizer or Admin" });}

        const events = await Event.find({
            $or: [
                { userId: userId }, // in case it's saved as a string
                { userId: new mongoose.Types.ObjectId(userId) } // correct usage with 'new'
            ]
        });

        if (!events || events.length === 0) {return res.status(404).json({ error: "No events found for this user" });}

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user events:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });

const getAllEvents = async (req, res) => {
    const events = await Event.find({}).sort({createdAt: -1});
    res.status(200).json(events);
};

const getEvent = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event'});
    }

    const event = await Event.findById(id);
    if(!event) {
        return res.status(404).json({error: 'No such event'});
    }
    res.status(200).json(event);
}

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
        } = req.body;

        const requiredFields = ['title', 'description', 'date', 'location', 'category', 'ticketPrice', 'totalTickets'];

        const missingFields = requiredFields.filter(field => {
            return req.body[field] === undefined || req.body[field] === null || req.body[field] === '';
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields.',
                missingFields
            });
        }

        if (totalTickets < 0 || ticketPrice < 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Total tickets and Ticket Price must be a positive integers'
            });
        }

        if (totalTickets == 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Total tickets cannot be 0'
            });
        }

        const organizerId = req.user.userId;
        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            category,
            image,
            ticketPrice,
            totalTickets,
            organizer : organizerId,
            status : 'pending',
            bookedTickets: 0,

        });

        res.status(201).json({
            status: 'success',
            message: 'Event created successfully and pending approval from an Administrator',
            data: newEvent
        });
    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    const notAllowed = ['_id', 'status', 'organizer', 'createdDate', 'category', 'ticketPrice', 'description', 'title'];

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid event ID'});
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'No such event'});
        }

        const protectedFields = Object.keys(req.body).filter(field =>
            notAllowed.includes(field)
        );

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

        if (protectedFields.length > 0) {
            return res.status(400).json({
                error: `You cannot modify protected fields: ${protectedFields.join(', ')}`,
            });
        }

        const updatedEvent = await Event.findOneAndUpdate(
            { _id: id },
            allowedUpdates,
            { new: true }
        );

        const toReturn = await Event.findById(id);

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
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'No such event' });
        }

        res.status(200).json({
            message: 'Event deleted successfully',
            deletedEvent: {
                id: deletedEvent._id,
                title: deletedEvent.title
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error during deletion' });
    }
};

const approveEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such event' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be either "approved" or "rejected"'
            });
        }

        if (event.status === status) {
            return res.status(400).json({
                message: `Event is already ${status}`
            });
        }

        event.status = status;
        await event.save();

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
    createEvent,
    getAllEvents,
    getEvent,
    getMyEvents,
    getEventAnalytics,
    updateEvent,
    deleteEvent,
    approveEvent
}