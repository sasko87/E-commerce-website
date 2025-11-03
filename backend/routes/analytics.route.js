import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { analyticsData } from "../handlers/analytics.handler.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, analyticsData);

export default router;
