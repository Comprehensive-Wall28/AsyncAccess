const Event = require('../models/event');
const bookingModel = require("../models/booking")

const mongoose = require("mongoose");

const deleteBookingData = async (eventId) => {
    try {
        const bookingDeletionResult = await bookingModel.deleteMany({event : eventId});
        console.log(`Deleted ${bookingDeletionResult.deletedCount} bookings for event ID: ${eventId}`);
    } catch (error) {
        console.error("Error deleting event data:", error);
    }
};

const getMyEvents = async (req, res) => {
    const organizerId = req.user.userId;

    try {
        const events = await Event.find({ organizer: organizerId })
            .select('title description date location category image ticketPrice totalTickets bookedTickets status createdAt') 
            .sort({ createdAt: -1 }); //sort by creation date

        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching organizer events:", error.message);
        return res.status(500).json({ error: "Internal Server Error while fetching events" });
    }
};

const getEventAnalytics = async (req, res) => {
    try {
        const organizerId = req.user.userId;

        const events = await Event.find({ organizer: organizerId })
                                  .select('title ticketPrice totalTickets bookedTickets') 
                                  .sort({ createdAt: -1 }); 

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this Organizer to generate analytics." });
        }

        const eventsAnalytics = events.map(event => {
            // Calculate percentage, handle potential division by zero
            const bookedPercentage = event.totalTickets > 0
                ? parseFloat(((event.bookedTickets / event.totalTickets) * 100).toFixed(2)) 
                : 0; 

            return {
                _id: event._id, 
                title: event.title,
                ticketPrice: event.ticketPrice,
                totalTickets: event.totalTickets,
                bookedTickets: event.bookedTickets,
                bookedPercentage: bookedPercentage
            };
        });
        return res.status(200).json(eventsAnalytics);

    } catch (error) {
        console.error("Error fetching event analytics:", error.message);
        return res.status(500).json({ error: "Internal Server Error while fetching analytics" });
    }
};

        const getAllEvents = async (req, res) => {
            const events = await Event.find({status: 'approved'}).sort({createdAt: -1});
            res.status(200).json(events);
        };

        const getEvent = async (req, res) => {
            const {id} = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({error: 'No such event'});
            }

            const event = await Event.findById(id);
            if (!event) {
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
                    organizer: organizerId,
                    status: 'pending',
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
                const {id} = req.params;

                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({error: 'Invalid event ID'});
                }

                const event = await Event.findById(id);
                if (!event) {
                    return res.status(404).json({error: 'No such event'});
                }

                if (event.organizer.toString() !== req.user.userId) {
                    return res.status(403).json({ error: 'Forbidden: You are not authorized to update this event.' });
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
                    {_id: id},
                    allowedUpdates,
                    {new: true}
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
                const {id} = req.params;

                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({error: 'Invalid event ID'});
                }

                const event = await Event.findById(id);

                if (!event) {
                    return res.status(404).json({ error: 'No such event found' });
                }

                if (event.organizer.toString() !== req.user.userId) {
                    return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this event.' });
                }

                await deleteBookingData(id); // Cascade delete

                const deletedEvent = await Event.findByIdAndDelete(id);

                res.status(200).json({
                    message: 'Event deleted successfully',
                    deletedEvent: {
                        id: deletedEvent._id,
                        title: deletedEvent.title
                    }
                });

            } catch (error) {
                console.log(error)
                res.status(500).json({error: 'Server error during deletion'});
            }
        };

        const approveEvent = async (req, res, next) => {
            try {
                const {id} = req.params;
                const {status} = req.body;

                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(404).json({error: 'No such event'});
                }

                const event = await Event.findById(id);
                if (!event) {
                    return res.status(404).json({error: 'Event not found'});
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
};
        
        