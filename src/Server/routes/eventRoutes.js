const express = require('express');
const router = express.Router();

const {
    getMyEvents,
    getEventAnalytics
} = require('../controllers/eventController.js');

const authenticate = require('../middleware/authenticationMiddleware.js');

//Get all events
router.get('/',authenticate, getMyEvents);

//Get analytics... obviously
router.get('/analytics',getEventAnalytics);

module.exports = router;