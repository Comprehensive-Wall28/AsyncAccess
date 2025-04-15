const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware.js');
const authorizationMiddleware = require('../middleware/authorizationMiddleware.js');
const userController = require("../controllers/userControllers.js");
const bookingController = require("../controllers/bookingController.js");
const eventController = require("../controllers/eventController.js");

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

router.use(authenticationMiddleware)

router.get("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),
    userController.getCurrentUser)

router.get('/bookings',authenticationMiddleware, authorizationMiddleware([ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER])
    , bookingController.getMyBookings)

router.get('/events',authenticationMiddleware, authorizationMiddleware([ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER])
    , eventController.getMyEvents);

router.get('/events/analytics',authenticationMiddleware, authorizationMiddleware([ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER])
    , eventController.getEventAnalytics);

//the events and bookings HAVE to come before anything that takes from ids, do not ask me
//ask the person that decided that javascript should ever touch the backend

router.put("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),
    userController.updateCurrentUserProfile)
router.get('/', authorizationMiddleware([ROLES.ADMIN]), userController.getAllUsers)
router.get('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.getUser)
router.put("/:id", authorizationMiddleware([ROLES.ADMIN]), userController.updateUserById)

router.delete('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.deleteUser)

module.exports = router;