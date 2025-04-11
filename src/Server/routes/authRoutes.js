import { Router } from "express";
const router = Router();

import userController from "../controllers/userControllers.js";

router.post("/login", userController.login ); 

router.post("/register", userController.register);

export default router;
