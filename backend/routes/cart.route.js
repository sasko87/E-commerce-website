import express from "express";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
} from "../handlers/cart.handler.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-to-cart", protectRoute, addToCart);
router.get("/", protectRoute, getCartProducts);

router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;
