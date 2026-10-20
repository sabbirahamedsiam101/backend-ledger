import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import accountController from "../controllers/account.controller.js";
const router = express.Router();

/*
 * - POST
 * - /api/auth/register
 * - Create a new Account
 *  */
router.post("/" , authenticate, accountController.createAccountController);
export default router;
