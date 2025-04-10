import { Router } from "express";
import {
  sendOTP,
  refreshAccessToken,
  finalizeAuth,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/otp", sendOTP);
router.post("/refresh", refreshAccessToken);
router.post("/finalize", finalizeAuth);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
