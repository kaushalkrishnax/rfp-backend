import { v4 as uuidv4 } from "uuid";
import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function getCategories(req, res) {
  try {
    const categories = await sql`
      SELECT * FROM menu
    `;
    return ApiResponse(res, 200, categories, "Categories fetched successfully");
  } catch (err) {
    console.error("Error fetching categories:", err);
    return ApiResponse(res, 500, null, "Failed to fetch categories");
  }
}

export async function getItemsByCategory(req, res) {
  const { id } = req.params;

  if (!id) {
    return ApiResponse(res, 400, null, "Invalid request params");
  }

  try {
    const items = await sql`
      SELECT * FROM menu_items WHERE category_id = ${id}
    `;

    const formattedItems = items.map((item) => ({
      ...item,
      variants: JSON.parse(item.variants),
    }));
    return ApiResponse(res, 200, formattedItems, "Items fetched successfully");
  } catch (err) {
    console.error("Error fetching items:", err);
    return ApiResponse(res, 500, null, "Failed to fetch items");
  }
}

export async function getPopularItems(req, res) {
  try {
    const popularItems = await sql`
      WITH ItemOrderCounts AS (
        SELECT
          (elem->>'id') AS item_id,
          COALESCE((elem->>'quantity')::int, 1) AS quantity
        FROM
          orders,
          jsonb_array_elements(items) AS elem
        WHERE
          jsonb_typeof(items) = 'array'
          AND elem->>'id' IS NOT NULL
      ),
      AggregatedCounts AS (
        SELECT
          item_id,
          SUM(quantity)::int AS total_quantity
        FROM ItemOrderCounts
        GROUP BY item_id
      )
      SELECT
        mi.*,
        m.image AS category_image,
        m.name AS category_name,
        COALESCE(ac.total_quantity, 0) AS order_count
      FROM menu_items mi
      INNER JOIN menu m ON mi.category_id = m.id
      LEFT JOIN AggregatedCounts ac ON mi.id::text = ac.item_id
      ORDER BY order_count DESC
      LIMIT 6;
    `;

    return ApiResponse(res, 200, popularItems, "Popular items fetched successfully");
  } catch (error) {
    console.error("Error fetching popular items:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return ApiResponse(res, 500, null, `Failed to fetch popular items: ${errorMessage}`);
  }
}

export async function getTopItems(req, res) {
  try {
    const topItems = await sql`
      WITH ItemOrderCounts AS (
        SELECT
          (elem->>'id') AS item_id,
          COALESCE((elem->>'quantity')::int, 1) AS quantity
        FROM
          orders,
          jsonb_array_elements(items) AS elem -- Use json_array_elements for JSON type
        WHERE
          jsonb_typeof(items) = 'array'
          AND elem->>'id' IS NOT NULL
      ),
      AggregatedCounts AS (
        SELECT
          item_id,
          SUM(quantity)::int AS total_quantity
        FROM ItemOrderCounts
        GROUP BY item_id
      ),
      RankedItems AS (
        SELECT
          mi.id,
          mi.category_id,
          mi.name,
          m.image AS category_image,
          COALESCE(ac.total_quantity, 0) AS order_count,
          ROW_NUMBER() OVER(PARTITION BY mi.category_id ORDER BY COALESCE(ac.total_quantity, 0) DESC, mi.id) as rn
        FROM menu_items mi
        INNER JOIN menu m ON mi.category_id = m.id
        LEFT JOIN AggregatedCounts ac ON mi.id::text = ac.item_id
      )
      SELECT
        id,
        category_id,
        name,
        category_image, order_count
      FROM RankedItems
      WHERE rn = 1
      ORDER BY order_count DESC, category_id -- Order the final categories by popularity, then ID
      LIMIT 8;
    `;

    return ApiResponse(res, 200, topItems, "Top items fetched successfully");
  } catch (error) {
    console.error("Error fetching top items:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return ApiResponse(res, 500, null, `Failed to fetch top items: ${errorMessage}`);
  }
}

export async function addMenuCategory(req, res) {
  const { name, image } = req.body;

  if (!name || !image) {
    return ApiResponse(res, 400, null, "Invalid request body");
  }

  const id = uuidv4();

  try {
    await sql`
      INSERT INTO menu (id, name, image)
      VALUES (${id}, ${name}, ${image})
    `;
    return ApiResponse(
      res,
      201,
      { id, name, image },
      "Category added successfully"
    );
  } catch (err) {
    console.error("Error adding category:", err);
    return ApiResponse(res, 500, null, "Failed to add category");
  }
}

export async function removeMenuCategory(req, res) {
  const { id } = req.params;

  if (!id) {
    return ApiResponse(res, 400, null, "Invalid request params");
  }

  try {
    await sql`
      DELETE FROM menu WHERE id = ${id}
    `;
    return ApiResponse(res, 200, null, "Category removed successfully");
  } catch (err) {
    console.error("Error removing category:", err);
    return ApiResponse(res, 500, null, "Failed to remove category");
  }
}

export async function updateMenuCategory(req, res) {
  const { id, name, image } = req.body;

  if (!id || !name || !image) {
    return ApiResponse(res, 400, null, "Invalid request body");
  }

  try {
    await sql`
      UPDATE menu
      SET name = ${name}, image = ${image}
      WHERE id = ${id}
    `;
    return ApiResponse(
      res,
      200,
      { id, name, image },
      "Category updated successfully"
    );
  } catch (err) {
    console.error("Error updating category:", err);
    return ApiResponse(res, 500, null, "Failed to update category");
  }
}

export async function addItemToCategory(req, res) {
  const { category_id, name, variants } = req.body;

  if (
    !category_id ||
    !name ||
    !Array.isArray(variants) ||
    variants.length === 0
  ) {
    return ApiResponse(res, 400, null, "Invalid request body");
  }

  const cleanedVariants = variants
    .map((v) => ({
      name: v.name.trim(),
      price: parseFloat(v.price),
    }))
    .filter((v) => v.name && !isNaN(v.price) && v.price >= 0);

  if (cleanedVariants.length === 0) {
    return ApiResponse(res, 400, null, "Invalid variants");
  }

  const id = uuidv4();

  try {
    await sql`
      INSERT INTO menu_items (id, category_id, name, variants)
      VALUES (${id}, ${category_id}, ${name}, ${JSON.stringify(variants)})
    `;

    return ApiResponse(
      res,
      201,
      { id, category_id, name, variants },
      "Item added successfully"
    );
  } catch (err) {
    console.error("Error adding item:", err);
    return ApiResponse(res, 500, null, "Failed to add item");
  }
}

export async function removeItemFromCategory(req, res) {
  const { id } = req.params;

  if (!id) {
    return ApiResponse(res, 400, null, "Invalid request params");
  }

  try {
    await sql`
      DELETE FROM menu_items WHERE id = ${id}
    `;
    return ApiResponse(res, 200, null, "Item removed successfully");
  } catch (err) {
    console.error("Error removing item:", err);
    return ApiResponse(res, 500, null, "Failed to remove item");
  }
}

export async function updateMenuItem(req, res) {
  const { id, name, variants } = req.body;

  if (!id || !name || !variants || typeof variants !== "object") {
    return ApiResponse(res, 400, null, "Invalid request body");
  }

  try {
    await sql`
      UPDATE menu_items
      SET name = ${name}, variants = ${JSON.stringify(variants)}
      WHERE id = ${id}
    `;
    return ApiResponse(res, 200, null, "Item updated successfully");
  } catch (err) {
    console.error("Error updating item:", err);
    return ApiResponse(res, 500, null, "Failed to update item");
  }
}
