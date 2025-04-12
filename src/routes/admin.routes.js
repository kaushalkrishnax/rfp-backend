import { Router } from "express";
import { verifyAdminToken } from "../middlewares/auth.middleware.js";
import {
  getAdminOrders,
  updateAdminOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/orders", verifyAdminToken, getAdminOrders);
router.put("/orders/update/:id", verifyAdminToken, updateAdminOrder);

export default router;
