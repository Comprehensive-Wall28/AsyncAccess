import { Router } from "express";
const router = Router();
import authenticationMiddleware from '../middleware/authenticationMiddleware.js';

import userController from "../controllers/userControllers.js";

router.post("/login", userController.login );

router.post("/register", userController.register);


router.put("/update-password", authenticationMiddleware, userController.updatePassword);

//(Forgot Password Step 1)
router.post("/forgetPassword", userController.requestPasswordReset);

//(Forgot Password Step 2)
router.put("/reset-password", userController.resetPassword);

export default router;
