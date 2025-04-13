const express = require('express');
const router = express.Router();

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent, getEventAnalytics
} = require('../controllers/eventController');

//Get User events
//router.get('/user/:id', getUserEvents);  didn't do it yet

//Get all events
router.get('/', getAllEvents);

//Get analytics... obviously
router.get('/analytics',getEventAnalytics);

module.exports = router;