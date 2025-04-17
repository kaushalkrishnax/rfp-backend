import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import admin from "firebase-admin";

export async function sendOrderNotification({
  orderId,
  userId,
  status,
  title,
  body,
  data = {},
}) {
  try {
    const [user] = await sql`
      SELECT fcm_token FROM users WHERE id = ${userId}
    `;

    const [adminUser] = await sql`
      SELECT fcm_token FROM users WHERE role = 'admin' LIMIT 1
    `;

    if (user?.fcm_token) {
      const userMessage = {
        notification: {
          title: title || `Order ${status}`,
          body: body || `Your order #${orderId.slice(0, 8)} has been ${status}`,
        },
        data: {
          orderId,
          status,
          timestamp: new Date().toISOString(),
          click_action: "OPEN_ORDER_DETAIL",
          ...data,
        },
        token: user.fcm_token,
      };

      try {
        await admin.messaging().send(userMessage);
      } catch (error) {
        console.error("Error sending user notification:", error);
      }
    }

    if (adminUser?.fcm_token) {
      const adminMessage = {
        notification: {
          title: "New Order Received",
          body: `Order #${orderId.slice(
            0,
            8
          )} has been placed with ${status} status`,
        },
        data: {
          orderId,
          status,
          timestamp: new Date().toISOString(),
          click_action: "OPEN_ADMIN_ORDER_DETAIL",
          ...data,
        },
        token: adminUser.fcm_token,
      };

      try {
        await admin.messaging().send(adminMessage);
      } catch (error) {
        console.error("Error sending admin notification:", error);
      }
    }

    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
}

export async function createOrder({
  userId,
  items,
  amount,
  paymentMethod,
  paymentStatus,
  razorpayOrderId = null,
  razorpayPaymentId = null,
}) {
  try {
    const orderId = uuidv4();

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
        ${orderId},
        ${userId},
        ${JSON.stringify(items)},
        ${Number(amount)},
        'pending',
        ${paymentMethod},
        ${paymentStatus},
        ${razorpayOrderId},
        ${razorpayPaymentId}
      )
      RETURNING *;
    `;

    await sendOrderNotification({
      orderId,
      userId,
      status: "created",
      title: "Order Placed Successfully",
      body: `Your order #${orderId.slice(0, 8)} has been placed successfully`,
      data: {
        amount: String(amount),
        paymentMethod,
        items: JSON.stringify(items),
      },
    });

    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}

export async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body;

    if (!amount) {
      return ApiResponse(res, 400, null, "Missing 'amount'");
    }

    const options = {
      amount: Number(amount) * 100,
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
    console.error("Error creating Razorpay order:", error);
    return ApiResponse(res, 500, null, error.message);
  }
}

export const verifyRazorpayOrder = async (req, res) => {
  const { id: userId } = req.user;

  const {
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
      const order = await createOrder({
        userId,
        items,
        amount: Number(amount),
        paymentMethod: "razorpay",
        paymentStatus: "success",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      return ApiResponse(
        res,
        200,
        order,
        "Payment verified and order recorded successfully"
      );
    } catch (error) {
      console.error("Error creating order:", error);
      return ApiResponse(res, 500, null, error.message);
    }
  } else {
    console.error("Payment verification failed");
    return ApiResponse(res, 400, null, "Payment verification failed");
  }
};

export const createCodOrder = async (req, res) => {
  const { id: userId } = req.user;
  const { items, amount } = req.body;

  if (!amount || !items || !items.length) {
    return ApiResponse(res, 400, null, "Missing 'amount' or 'items'");
  }

  try {
    const order = await createOrder({
      userId,
      items,
      amount: Number(amount),
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    return ApiResponse(res, 201, order, "COD Order created successfully");
  } catch (error) {
    console.error("Error creating COD order:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const updateAdminOrder = async (req, res) => {
  const { id: orderId } = req.params;
  if (!orderId) {
    return ApiResponse(res, 400, null, "Missing 'order_id' in params");
  }

  if (!req.body.status) {
    return ApiResponse(res, 400, null, "Missing 'status' in request body");
  }

  try {
    const [updatedOrder] = await sql`
      UPDATE orders
      SET status = ${req.body.status}
      WHERE id = ${orderId}
      RETURNING *;
    `;

    if (!updatedOrder) {
      return ApiResponse(res, 404, null, "Order not found");
    }

    await sendOrderNotification({
      orderId,
      userId: updatedOrder.user_id,
      status: updatedOrder.status,
      title: `Order ${updatedOrder.status}`,
      body: `Your order #${orderId.slice(0, 8)} has been ${
        updatedOrder.status
      }`,
      data: {
        updatedAt: new Date().toISOString(),
      },
    });

    return ApiResponse(res, 200, updatedOrder, "Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    let statusFilter = req.query.status;
    let offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    let orders;

    if (statusFilter === "all") {
      orders = await sql`
        SELECT * FROM orders
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      orders = await sql`
        SELECT * FROM orders
        WHERE status = ${statusFilter || "pending"}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return ApiResponse(res, 200, orders, "Fetched all orders successfully");
  } catch (error) {
    console.error("Error fetching orders:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const getUserOrders = async (req, res) => {
  const { id: user_id } = req.user;

  try {
    let statusFilter = req.query.status;
    let offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    let orders;

    if (statusFilter === "all") {
      orders = await sql`
        SELECT * FROM orders
        WHERE user_id = ${user_id}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      orders = await sql`
        SELECT * FROM orders
        WHERE user_id = ${user_id}
          AND status = ${statusFilter || "pending"}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    return ApiResponse(res, 200, orders, "Fetched user orders successfully");
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const getOrderById = async (req, res) => {
  const { id: order_id } = req.params;
  if (!order_id) {
    return ApiResponse(res, 400, null, "Missing 'order_id' in params");
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
