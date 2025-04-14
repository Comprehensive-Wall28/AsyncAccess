const Booking = require('../models/booking');
const Event = require('../models/event');
const mongoose = require('mongoose');

const notFoundResponse = { error: 'No such event' };

const getEventAnalytics = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    const userType = req.user.role;

    if(!mongoose.Types.ObjectId.isValid(id)) {return res.status(404).json(notFoundResponse);}
    if (!event) {return res.status(404).json({ error: 'No such event analytics' });}
    if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

    if(userType!=="Organizer"){return res.status(401).json({ error: "User must be Organizer" });}

    try {
        const bookingsCount = await Booking.aggregate([
            { $match: { eventId: mongoose.Types.ObjectId(id) } },  // Match the event ID
            { $count: 'totalBookings' }
        ]);
        const totalBookings = bookingsCount.length > 0 ? bookingsCount[0].totalBookings : 0;

        res.status(200).json({
            event,
            analytics: {
                totalBookings,
                //remainingTickets: event.totalTickets - totalBookings,
                //revenueGenerated: event.ticketPrice * totalBookings
            }
        });
    } catch (err) {
        console.error("Error fetching event analytics:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("ID "+userId)
        const userType = req.user.role;

        if (!userId) {return res.status(401).json({ error: "Unauthorized: User not logged in" });}

        if(userType!=="Admin"&&userType!=="Organizer"){
            return res.status(401).json({ error: "User must be Organizer or higher" });
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

module.exports = {
    getMyEvents,
    getEventAnalytics,
}