const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');
const userController = require("../controllers/userControllers.js");
const eventController = require("../controllers/eventController.js");
const bookingController = require("../controllers/bookingController.js");



const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

//Public routes:


router.use(authenticationMiddleware);
router.put("/:id", userController.updateUser);
router.get("/profile", userController.getCurrentUser)

router.get('/bookings', bookingController.getMyBookings);
router.get('/events', eventController.getEvent);
router.get('/events/analytics', eventController.getEventAnalytics);

// --- Admin Only Routes ---
// Apply authorization middleware for Admin role
router.get('/', authorizationMiddleware([ROLES.ADMIN]), userController.getAllUsers);
router.get('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.getUser);
router.put('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.updateUser);
router.delete('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.deleteUser);


module.exports = router;