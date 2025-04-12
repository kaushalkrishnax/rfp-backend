import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getUserOrders,
  createRazorpayOrder,
  verifyRazorpayOrder,
  createCodOrder,
  getOrderById,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/", verifyToken, getUserOrders);
router.post("/create/razorpay", verifyToken, createRazorpayOrder);
router.post("/verify/razorpay", verifyToken, verifyRazorpayOrder);
router.post("/create/cod", verifyToken, createCodOrder);
router.get("/order/:id", verifyToken, getOrderById);

export default router;
