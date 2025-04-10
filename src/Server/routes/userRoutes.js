const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers.js");

router.put("/users/:id", userController.updateUser);

module.exports = router;