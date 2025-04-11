const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');
const userController = require("../controllers/userControllers.js");
const {getMyBookings} = require("../controllers/bookingController");

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

//Public routes:

router.use(authenticationMiddleware);
router.put("/:id", userController.updateUser);
router.get("/profile", userController.getCurrentUser)

router.get('/bookings', getMyBookings);

// --- Admin Only Routes ---
// Apply authorization middleware for Admin role
router.get('/', authorizationMiddleware([ROLES.ADMIN]), userController.getAllUsers);
router.get('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.getUser);
router.put('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.updateUser);
router.delete('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.deleteUser);


module.exports = router;