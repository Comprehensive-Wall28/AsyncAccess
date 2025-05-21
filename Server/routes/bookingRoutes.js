
// bookingRoutes.js
const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');
const bookingController = require("../controllers/bookingController");

const ROLES = {
  ADMIN: 'Admin',
  ORGANIZER: 'Organizer',
  USER: 'User'
};

router.post(
    "/",
    authenticationMiddleware,
    authorizationMiddleware(ROLES.USER),
    bookingController.createBooking
);

router.delete("/delete-cancelled",authenticationMiddleware,authorizationMiddleware(ROLES.ADMIN), bookingController.deleteCancelledBookings)

router.get(
    "/:id",
    authenticationMiddleware,
    authorizationMiddleware(ROLES.USER),
    bookingController.getBookingById
);

router.delete(
    "/:id",
    authenticationMiddleware,
    authorizationMiddleware(ROLES.USER),
    bookingController.cancelBooking
);

module.exports = router;