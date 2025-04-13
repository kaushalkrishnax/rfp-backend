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
  updateAdminOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/user", verifyUserToken, getUserOrders);
router.post("/create/razorpay", verifyUserToken, createRazorpayOrder);
router.post("/verify/razorpay", verifyUserToken, verifyRazorpayOrder);
router.post("/create/cod", verifyUserToken, createCodOrder);
router.get("/:id", verifyUserToken, getOrderById);

router.get("/admin", verifyAdminToken, getAdminOrders);
router.put("/update/:id", verifyAdminToken, updateAdminOrder);

export default router;
