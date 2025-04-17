const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    getAllEventsAdmin
} = require('../controllers/eventController');

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

//Get all events
router.get('/', getAllEvents);

//Create event
router.post('/',authenticationMiddleware, authorizationMiddleware([ROLES.ORGANIZER]), createEvent);

router.get('/review',authenticationMiddleware, authorizationMiddleware([ROLES.ADMIN]), getAllEventsAdmin)

//Get one event
router.get('/:id', getEvent);

//Delete event
router.delete('/:id',authenticationMiddleware, authorizationMiddleware([ROLES.ORGANIZER, ROLES.ADMIN]), deleteEvent);

//Update event
router.put('/:id',authenticationMiddleware, authorizationMiddleware([ROLES.ORGANIZER, ROLES.ADMIN]), updateEvent);

//Approve event
router.put('/:id/status',authenticationMiddleware, authorizationMiddleware([ROLES.ADMIN]), approveEvent);

module.exports = router;
