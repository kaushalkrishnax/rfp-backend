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
import {
  verifyUserToken,
  verifyAdminToken,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categories", verifyUserToken, getCategories);
router.get("/categories/:id", verifyUserToken, getItemsByCategory);
router.get("/items", verifyUserToken, getTopItems);

router.post("/categories/add", verifyAdminToken, addMenuCategory);
router.delete("/categories/remove/:id", verifyAdminToken, removeMenuCategory);
router.put("/categories/update", verifyAdminToken, updateMenuCategory);

router.post("/items/add", verifyAdminToken, addItemToCategory);
router.delete("/items/remove/:id", verifyAdminToken, removeItemFromCategory);
router.put("/items/update", verifyAdminToken, updateMenuItem);

export default router;
