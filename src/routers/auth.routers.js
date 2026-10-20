import express from "express";
import authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * - POST
 * - /api/auth/register
 */
router.post("/register", authController.userRegisterController);


/**
 * - POST
 * - /api/auth/login
 */
router.post("/login", authController.userLoginController);

/**
 * - POST
 * - /api/auth/refresh
 */
router.post("/refresh", authController.refreshAccessTokenController);

/**
 * - POST
 * - /api/auth/logout
 */
router.post("/logout", authenticate, authController.userLogoutController);
export default router;
