import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createChechoutSession,
  checkoutSuccess,
} from "../handlers/payment.handler.js";
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createChechoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
export default router;
