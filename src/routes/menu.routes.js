import { Router } from "express";
import {
  addMenuCategory,
  removeMenuCategory,
  addItemsToCategory,
  removeItemFromCategory,
} from "../controllers/menu.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/categories/add", verifyToken, addMenuCategory);
router.delete("/categories/remove/:id", verifyToken, removeMenuCategory);

router.post("/items/add", verifyToken, addItemsToCategory);
router.delete("/items/remove/:item_id", verifyToken, removeItemFromCategory);

export default router;
