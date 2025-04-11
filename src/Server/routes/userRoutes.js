const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers.js");

router.put("/users/:id", userController.updateUser);

// get user's bookings
router.get("/api/v1/users/bookings", userController.getUserBookings);

// get user's events
router.get("/api/v1/users/events", userController.getUserEvents);

// get analytics of user's events
router.get("/api/v1/users/events/analytics", userController.getUserEventsAnalytics);

module.exports = router;