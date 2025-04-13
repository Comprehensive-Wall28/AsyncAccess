const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');
const userController = require("../controllers/userControllers.js");

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

router.use(authenticationMiddleware)

router.get("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),
    userController.getCurrentUser)

router.put("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),
    userController.updateCurrentUserProfile)

router.get('/', authorizationMiddleware([ROLES.ADMIN]), userController.getAllUsers)
router.get('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.getUser)
router.put("/:id", authorizationMiddleware([ROLES.ADMIN]), userController.updateUserById)
router.delete('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.deleteUser)

module.exports = router;