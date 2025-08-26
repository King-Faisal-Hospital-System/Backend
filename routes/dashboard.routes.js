import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";

const router = express.Router();

//  dashboard statistics
router.get("/stats", getDashboardStats);

export default router;
