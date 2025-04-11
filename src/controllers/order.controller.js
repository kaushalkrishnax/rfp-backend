import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// Create Razorpay order
export async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    if (!amount) {
      return ApiResponse(res, 400, null, "Missing 'amount'");
    }

    const options = {
      amount: Number(amount),
      currency: "INR",
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return ApiResponse(
      res,
      201,
      razorpayOrder,
      "Razorpay order created successfully"
    );
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  }
}

// Verify Razorpay payment and create order
export const verifyRazorpayPayment = async (req, res) => {
  const {
    user_id,
    items,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
  } = req.body;

  if (
    !razorpay_signature ||
    !amount ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !user_id ||
    !items ||
    !items.length
  ) {
    return ApiResponse(res, 400, null, "Missing required fields");
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      const [order] = await sql`
        INSERT INTO orders (
          id,
          user_id,
          items,
          amount,
          status,
          payment_method,
          payment_status,
          razorpay_order_id,
          razorpay_payment_id
        )
        VALUES (
          ${uuidv4()},
          ${user_id},
          ${JSON.stringify(items)},
          ${Number(amount)},
          'pending',
          'razorpay',
          'success',
          ${razorpay_order_id},
          ${razorpay_payment_id}
        )
        RETURNING *;
      `;

      return ApiResponse(
        res,
        200,
        order,
        "Payment verified and order recorded successfully"
      );
    } catch (error) {
      return ApiResponse(res, 500, null, error.message);
    }
  } else {
    return ApiResponse(res, 400, null, "Payment verification failed");
  }
};

// COD order creation
export const createCodOrder = async (req, res) => {
  const { user_id, items, amount } = req.body;

  if (!user_id || !amount || !items || !items.length) {
    return ApiResponse(
      res,
      400,
      null,
      "Missing 'user_id', 'amount' or 'items'"
    );
  }

  try {
    const [order] = await sql`
      INSERT INTO orders (
        id,
        user_id,
        items,
        amount,
        status,
        payment_method,
        payment_status
      )
      VALUES (
        ${uuidv4()},
        ${user_id},
        ${JSON.stringify(items)},
        ${Number(amount)},
        'pending',
        'cod',
        'pending'
      )
      RETURNING *;
    `;

    return ApiResponse(res, 201, order, "COD Order created successfully");
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  }
};

// 🔍 Get all orders (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
      WHERE status = ${req.query.status || "pending"}
      LIMIT 10 OFFSET ${req.query.offset || 0}`;

    return ApiResponse(res, 200, orders, "Fetched all orders successfully");
  } catch (error) {
    console.error("Error fetching orders:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

// 🔍 Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return ApiResponse(res, 400, null, "Missing user_id in params");
  }

  try {
    const orders = await sql`
      SELECT * FROM orders
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC
      LIMIT 10 OFFSET ${req.query.offset || 0}
    `;
    return ApiResponse(res, 200, orders, "Fetched user orders successfully");
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

// 🔍 Get order by ID
export const getOrderById = async (req, res) => {
  const { order_id } = req.params;
  if (!order_id) {
    return ApiResponse(res, 400, null, "Missing order_id in params");
  }

  try {
    const [order] = await sql`
      SELECT * FROM orders
      WHERE id = ${order_id}
    `;
    if (!order) {
      return ApiResponse(res, 404, null, "Order not found");
    }
    return ApiResponse(res, 200, order, "Fetched order successfully");
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};
