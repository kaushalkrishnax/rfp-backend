import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/tokenHandler.js";
import { getAuth } from "firebase-admin/auth";

export const refreshAccessToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token)
    return ApiResponse(res, 400, null, "Missing 'refresh_token'");

  try {
    const access_token = await createAccessToken(refresh_token);
    return ApiResponse(res, 200, { access_token }, "Access token refreshed");
  } catch (error) {
    console.error("Refresh token error:", error);
    return ApiResponse(
      res,
      403,
      null,
      error.message || "Invalid or expired refresh token"
    );
  }
};

export const finalizeAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return ApiResponse(res, 400, null, "Missing 'idToken' or 'fcm_token'");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return ApiResponse(res, 400, null, "Phone number not found in token");
    }

    const userRecord = await getAuth().getUserByPhoneNumber(phone);
    if (!userRecord) {
      return ApiResponse(res, 404, null, "User not found in Firebase");
    }

    const [existingUser] = await sql`
      SELECT id, phone, refresh_token, role FROM users WHERE phone = ${phone}
    `;

    if (existingUser) {
      const access_token = await createAccessToken(existingUser.refresh_token);
      return ApiResponse(
        res,
        200,
        {
          id: existingUser.id,
          phone: existingUser.phone,
          role: existingUser.role,
          access_token,
          refresh_token: existingUser.refresh_token,
        },
        "Login successful"
      );
    }

    const user_id = uuidv4();
    const refresh_token = await createRefreshToken();

    const [newUser] = await sql`
      INSERT INTO users (id, phone, refresh_token)
      VALUES (${user_id}, ${phone}, ${refresh_token})
      RETURNING id, phone, role
    `;

    const access_token = await createAccessToken(refresh_token);

    return ApiResponse(
      res,
      201,
      { ...newUser, access_token, refresh_token },
      "User signed up successfully"
    );
  } catch (error) {
    console.error("Firebase auth failed:", error);
    return ApiResponse(
      res,
      401,
      null,
      "Invalid or expired Firebase credentials"
    );
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!id) return ApiResponse(res, 400, null, "Missing user ID");

  try {
    return ApiResponse(res, 200, null, "User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) return ApiResponse(res, 400, null, "Missing user ID");

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return ApiResponse(res, 200, null, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};

export const storeUserFcmToken = async (req, res) => {
  const { id: userId } = req.user;
  const { fcm_token } = req.body;

  if (!fcm_token) {
    return ApiResponse(res, 400, null, "Missing FCM token");
  }

  try {
    await sql`
      UPDATE users
      SET fcm_token = ${fcm_token}
      WHERE id = ${userId}
    `;

    return ApiResponse(
      res,
      200,
      null,
      "FCM token stored successfully"
    );
  } catch (error) {
    console.error("Error storing FCM token:", error);
    return ApiResponse(res, 500, null, error.message);
  }
};
