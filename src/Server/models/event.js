const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
    totalTickets: {
        type: Number,
        required: true,
        default: 0,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    bookedTickets: {
        type: Number,
        required: true,
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;