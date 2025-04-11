const express = require('express');
const router = express.Router();

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

//Get User events
//router.get('/user/:id', getUserEvents);  didn't do it yet

//Get all events
router.get('/events', getAllEvents);

//Get one event
router.get('/events/:id', getEvent);

//Create event
router.post('/events', createEvent);

//Delete event
router.delete('/events/:id', deleteEvent);

//Update event
router.patch('/events/:id', updateEvent);

module.exports = router;