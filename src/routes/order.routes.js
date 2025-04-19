import { Router } from "express";
import {
  verifyAdminToken,
  verifyUserToken,
} from "../middlewares/auth.middleware.js";
import {
  getUserOrders,
  createRazorpayOrder,
  verifyRazorpayOrder,
  createCodOrder,
  getOrderById,
  getAdminOrders,
  getOrdersStats,
  updateAdminOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/user", verifyUserToken, getUserOrders);
router.get("/admin", verifyAdminToken, getAdminOrders);
router.get("/stats", verifyAdminToken, getOrdersStats);
router.get("/:id", verifyUserToken, getOrderById);

router.post("/create/razorpay", verifyUserToken, createRazorpayOrder);
router.post("/verify/razorpay", verifyUserToken, verifyRazorpayOrder);
router.post("/create/cod", verifyUserToken, createCodOrder);

router.put("/update/:id", verifyAdminToken, updateAdminOrder);

export default router;
