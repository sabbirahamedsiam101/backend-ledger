import express from "express";
import transectionController from "../controllers/transection.controller.js";
const router = express.Router();

/**
 * - POST
 * - /api/transections/
 * - Create a new transection
 */

router.post("/", transectionController.createTransectionController);

export default router;