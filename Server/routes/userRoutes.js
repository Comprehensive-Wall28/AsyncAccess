const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware.js');
const authorizationMiddleware = require('../middleware/authorizationMiddleware.js');
const userController = require("../controllers/userControllers.js");
const bookingController = require("../controllers/bookingController.js");
const eventController = require("../controllers/eventController.js");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ROLES = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizer',
    USER: 'User'
};

// Configure multer for file storage
const profileUploadDir = 'public/uploads/profile-pictures/';
// Ensure the upload directory exists
fs.mkdirSync(profileUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function (req, file, cb) {
    // Use user ID to make filename unique and prevent overwriting by other users
    cb(null, req.user.userId + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files (jpg, jpeg, png, gif) are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter
});

router.use(authenticationMiddleware)

router.get("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),
    userController.getCurrentUser)

router.get('/bookings',authenticationMiddleware, authorizationMiddleware([ROLES.USER])
    , bookingController.getMyBookings)

router.get('/events',authenticationMiddleware, authorizationMiddleware([ROLES.ORGANIZER])
    , eventController.getMyEvents);

router.get('/events/analytics',authenticationMiddleware, authorizationMiddleware([ROLES.ORGANIZER])
    , eventController.getEventAnalytics);

// Add the logout route
router.post('/logout', authenticationMiddleware ,authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]), userController.logout);

//the events and bookings HAVE to come before anything that takes from ids, do not ask me
//ask the person that decided that javascript should ever touch the backend
//I agree -fady

router.put("/profile",authorizationMiddleware([ROLES.ADMIN , ROLES.ORGANIZER , ROLES.USER]),upload.single('profilePictureFile'),
    userController.updateCurrentUserProfile)
router.get('/', authorizationMiddleware([ROLES.ADMIN]), userController.getAllUsers)
router.get('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.getUser)
router.put("/:id", authorizationMiddleware([ROLES.ADMIN]), userController.updateUserById)

router.delete('/:id', authorizationMiddleware([ROLES.ADMIN]), userController.deleteUser)

module.exports = router;