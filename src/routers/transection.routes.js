import express from "express";
import transactionController from "../controllers/transaction.controller.js";
const router = express.Router();

/**
 * - POST
 * - /api/transections/
 * - Create a new transection
 */

router.post("/", transactionController.createTransectionController);

export default router;