// Use import for ESM syntax
import { Router } from "express";
const router = Router();

import userController from "../controllers/userControllers.js"; 

// * login
router.post("/login", userController.login ); 

// * register
router.post("/register", userController.register); 


export default router;
