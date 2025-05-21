const { Router } = require("express"); // Use destructuring to get Router
const router = Router();

const authenticationMiddleware = require('../middleware/authenticationMiddleware.js');
const userController = require("../controllers/userControllers.js");


router.post("/login", userController.login );

router.post("/register", userController.register);

router.put("/update-password", authenticationMiddleware, userController.updatePasswordLoggedIn);
//(Forgot Password Step 1)
router.put("/forgetPassword", userController.requestPasswordReset);
//(Forgot Password Step 2)
router.put("/reset-password", userController.resetPassword);

module.exports = router;