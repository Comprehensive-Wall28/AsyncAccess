const { Router } = require("express"); // Use destructuring to get Router
const router = Router();

const authenticationMiddleware = require('../middleware/authenticationMiddleware.js');
const userController = require("../controllers/userControllers.js");


router.post("/login", userController.login );

router.post("/register", userController.register);

router.post("/verify-email", userController.verifyEmail); // New route for email verification

router.post("/verify-mfa", userController.verifyMfa); // New route for MFA verification

router.put("/update-password", authenticationMiddleware, userController.updatePasswordLoggedIn);
//(Forgot Password Step 1)
router.put("/forgetPassword", userController.requestPasswordReset);
//(Forgot Password Step 2)
router.put("/reset-password", userController.resetPassword); // Fixed: Changed from POST to PUT for consistency

module.exports = router;