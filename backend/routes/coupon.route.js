import express from "express";
import { getCoupon, validateCoupon } from "../handlers/coupon.handler.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

export default router;
