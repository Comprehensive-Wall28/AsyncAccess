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
    approveEvent
} = require('../controllers/eventController');

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

router.use(authenticationMiddleware)

//Create event
router.post('/', authorizationMiddleware([ROLES.ORGANIZER]), createEvent);

//Get all events
router.get('/',authorizationMiddleware([ROLES.ORGANIZER, ROLES.USER, ROLES.ADMIN]), getAllEvents);

//Get one event
router.get('/:id', authorizationMiddleware([ROLES.ORGANIZER, ROLES.USER, ROLES.ADMIN]), getEvent);

//Delete event
router.delete('/:id', authorizationMiddleware([ROLES.ORGANIZER, ROLES.ADMIN]), deleteEvent);

//Update event
router.patch('/:id', authorizationMiddleware([ROLES.ORGANIZER, ROLES.ADMIN]), updateEvent);

//Approve event
router.patch('/:id/status', authorizationMiddleware([ROLES.ADMIN]), approveEvent);

module.exports = router;


