const Event = require('../models/event');
const mongoose = require('mongoose');

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
    }
};

module.exports = {
    getMyEvents,
    getEventAnalytics,
}