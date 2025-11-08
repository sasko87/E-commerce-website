import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  createChechoutSession,
  checkoutSuccess,
  getAllOrders,
  updateOrderStatus,
} from "../handlers/payment.handler.js";
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createChechoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.get("/get-all-orders", protectRoute, adminRoute, getAllOrders);
router.put("/:id", protectRoute, adminRoute, updateOrderStatus);
export default router;
