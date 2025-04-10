// Use import for ESM syntax
import { Router } from "express";
const router = Router();

// Import the *default* export from userControllers.js
// Give it a name (e.g., userController)
import userController from "../controllers/userControllers.js"; // <-- Changed import

// * login
router.post("/login", userController.login ); // You'll likely want to add login back later

// * register
// Access the 'register' method from the imported object
router.post("/register", userController.register); // <-- Use the imported object here

// Export the router as the default export
export default router;
