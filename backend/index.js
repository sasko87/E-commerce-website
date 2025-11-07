import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponsRoutes from "./routes/coupon.route.js";
import paymentsRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { getProfile } from "./handlers/auth.handler.js";
import { connectDB } from "./lib/db.js";
import { protectRoute } from "./middleware/auth.middleware.js";
import path from "path";
dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://mystore.stevkovski.xyz",
      "https://mystore.stevkovski.xyz",
      "http://www.mystore.stevkovski.xyz",
      "https://www.mystore.stevkovski.xyz",
    ],
    credentials: true, // allow cookies / auth headers if needed
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/profile", protectRoute, getProfile);




app.listen(process.env.PORT || 5000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
  connectDB();
});
