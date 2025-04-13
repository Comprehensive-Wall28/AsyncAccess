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
  bookingController.createBooking
);

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
  bookingController.deleteBooking
);

module.exports = router;