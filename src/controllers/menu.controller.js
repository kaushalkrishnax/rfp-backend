import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function getCategories(req, res) {
  try {
    const categories = await sql`
      SELECT * FROM menu_categories
    `;
    return ApiResponse(res, 200, categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return ApiResponse(res, 500, null, "Failed to fetch categories");
  }
}

export async function getItemsByCategory(req, res) {
  const { category_id } = req.params;

  try {
    const items = await sql`
      SELECT * FROM menu_items WHERE category_id = ${category_id}
    `;
    return ApiResponse(res, 200, items);
  } catch (err) {
    console.error("Error fetching items:", err);
    return ApiResponse(res, 500, null, "Failed to fetch items");
  }
}

export async function addMenuCategory(req, res) {
  const { category_id, name, image } = req.body;

  try {
    await sql`
      INSERT INTO menu_categories (id, name, image)
      VALUES (${category_id}, ${name}, ${image})
    `;
    return ApiResponse(res, 201, null, "Category added successfully");
  } catch (err) {
    console.error("Error adding category:", err);
    return ApiResponse(res, 500, null, "Failed to add category");
  }
}

export async function removeMenuCategory(req, res) {
  const { item_id } = req.params;

  try {
    await sql`
      DELETE FROM menu_categories WHERE id = ${item_id}
    `;
    return ApiResponse(res, 200, null, "Category removed successfully");
  } catch (err) {
    console.error("Error removing category:", err);
    return ApiResponse(res, 500, null, "Failed to remove category");
  }
}

export async function updateMenuCategory(req, res) {
  const { category_id, name, image } = req.body;

  try {
    await sql`
      UPDATE menu_categories
      SET name = ${name}, image = ${image}
      WHERE id = ${category_id}
    `;
    return ApiResponse(res, 200, null, "Category updated successfully");
  } catch (err) {
    console.error("Error updating category:", err);
    return ApiResponse(res, 500, null, "Failed to update category");
  }
}

export async function addItemsToCategory(req, res) {
  const { category_id, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const values = items.map((item) => [
    item.id,
    item.name,
    item.price,
    category_id,
  ]);

  try {
    await sql`
      INSERT INTO menu_items (id, name, description, price, category_id)
      VALUES ${sql(values)}
    `;
    return ApiResponse(res, 201, null, "Items added successfully");
  } catch (err) {
    console.error("Error adding items:", err);
    return ApiResponse(res, 500, null, "Failed to add items");
  }
}

export async function removeItemFromCategory(req, res) {
  const { item_id } = req.params;

  try {
    await sql`
      DELETE FROM menu_items WHERE id = ${item_id}
    `;
    return ApiResponse(res, 200, null, "Item removed successfully");
  } catch (err) {
    console.error("Error removing item:", err);
    return ApiResponse(res, 500, null, "Failed to remove item");
  }
}

export async function updateMenuItem(req, res) {
  const { item_id, name, price } = req.body;

  try {
    await sql`
      UPDATE menu_items
      SET name = ${name}, price = ${price}
      WHERE id = ${item_id}
    `;
    return ApiResponse(res, 200, null, "Item updated successfully");
  } catch (err) {
    console.error("Error updating item:", err);
    return ApiResponse(res, 500, null, "Failed to update item");
  }
}
