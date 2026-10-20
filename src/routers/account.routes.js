import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import accountController from "../controllers/account.controller.js";
const router = express.Router();

/*
 * - POST
 * - /api/accounts/create
 * - Create a new Account
 *  */
router.post("/create", authenticate, accountController.createAccountController);

/*
 * - POST
 * - /api/accounts
 * - All Accounts
 *  */
router.get("/", authenticate, accountController.getAllAccountsController); // note: This is a admin api , so we must add the authorization middleware later
export default router;
