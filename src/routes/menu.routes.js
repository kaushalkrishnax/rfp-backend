import { Router } from "express";
import {
  getCategories,
  getItemsByCategory,
  addMenuCategory,
  removeMenuCategory,
  updateMenuCategory,
  addItemsToCategory,
  removeItemFromCategory,
  updateMenuItem,
} from "../controllers/menu.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/categories/:category_id", getItemsByCategory);

router.post("/categories/add", verifyToken, addMenuCategory);
router.delete("/categories/remove/:id", verifyToken, removeMenuCategory);
router.put("/categories/update/:id", verifyToken, updateMenuCategory);

router.post("/items/add", verifyToken, addItemsToCategory);
router.delete("/items/remove/:item_id", verifyToken, removeItemFromCategory);
router.put("/items/update/:item_id", verifyToken, updateMenuItem);

export default router;
