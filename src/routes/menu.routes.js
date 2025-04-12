import { Router } from "express";
import {
  getCategories,
  getItemsByCategory,
  addMenuCategory,
  removeMenuCategory,
  updateMenuCategory,
  addItemToCategory,
  removeItemFromCategory,
  updateMenuItem,
  getTopItems,
} from "../controllers/menu.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categories", verifyToken, getCategories);
router.get("/categories/:id", verifyToken, getItemsByCategory);

router.post("/categories/add", verifyToken, addMenuCategory);
router.delete("/categories/remove/:id", verifyToken, removeMenuCategory);
router.put("/categories/update", verifyToken, updateMenuCategory);

router.get("/items", getTopItems);
router.post("/items/add", verifyToken, addItemToCategory);
router.delete("/items/remove/:id", verifyToken, removeItemFromCategory);
router.put("/items/update", verifyToken, updateMenuItem);

export default router;
