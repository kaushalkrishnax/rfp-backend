import { Router } from "express";
import {
  refreshAccessToken,
  finalizeAuth,
  updateUser,
  deleteUser,
  storeUserFcmToken,
} from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/refresh", refreshAccessToken);
router.post("/finalize", finalizeAuth);
router.put("/update/:id", verifyUserToken, updateUser);
router.delete("/delete/:id", verifyUserToken, deleteUser);
router.post("/fcm", verifyUserToken, storeUserFcmToken);

export default router;
