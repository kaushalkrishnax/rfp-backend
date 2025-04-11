import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createRazorpayOrder,
  createCodOrder,
  getOrders,
  getUserOrders,
  getOrderById,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/create/razorpay", verifyToken, createRazorpayOrder);
router.post("/create/cod", verifyToken, createCodOrder);
router.get("/orders", verifyToken, getOrders);
router.get("/user/orders", verifyToken, getUserOrders);
router.get("/order/:id", verifyToken, getOrderById);

export default router;
