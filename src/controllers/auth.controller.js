import { v4 as uuidv4 } from "uuid";
import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/tokenHandler.js";

export const sendOTP = async (req, res) => {
  const { phone } = req.query;
  if (!phone) return ApiResponse(res, 400, null, "Missing phone number");

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    await sql`
      INSERT INTO user_otps (phone, otp)
      VALUES (${phone}, ${otp})
      ON CONFLICT (phone) DO UPDATE
      SET otp = ${otp}
    `;

    const [user] = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;

    await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WAB_PHNO_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WAB_API_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `91${phone}`,
          type: "template",
          template: {
            name: "verification_otp",
            language: {
              code: "en_US",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: otp.toString(),
                  },
                ],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  {
                    type: "text",
                    text: otp,
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const method = user ? "ToLogin" : "ToSignup";

    return ApiResponse(res, 200, { phone, method }, "OTP sent successfully");
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token)
    return ApiResponse(res, 400, null, "Missing 'refresh_token'");

  try {
    const access_token = await createAccessToken(refresh_token);

    return ApiResponse(res, 200, { access_token }, "Access token refreshed");
  } catch (error) {
    return ApiResponse(
      res,
      403,
      null,
      error.message || "Invalid or expired refresh token"
    );
  }
};

export const finalizeAuth = async (req, res) => {
  const { phone, otp, full_name } = req.body || {};
  if (!phone || !otp)
    return ApiResponse(res, 400, null, "Missing 'phone' or 'OTP'");

  try {
    const [entry] = await sql`
      SELECT otp FROM user_otps WHERE phone = ${phone}
    `;

    if (!entry || entry.otp !== otp.toString()) {
      return ApiResponse(res, 401, null, "Invalid or expired OTP");
    }

    const [existingUser] = await sql`
      SELECT id, full_name, phone, refresh_token, role FROM users WHERE phone = ${phone}
    `;

    if (existingUser) {
      const access_token = await createAccessToken(existingUser.refresh_token);

      return ApiResponse(
        res,
        200,
        { ...existingUser, access_token },
        "Login successful"
      );
    }

    if (!full_name) {
      return ApiResponse(
        res,
        400,
        null,
        "Full name required to complete signup"
      );
    }

    const user_id = uuidv4();
    const refresh_token = await createRefreshToken();

    const [newUser] = await sql`
    INSERT INTO users (id, full_name, phone, refresh_token)
    VALUES (${user_id}, ${full_name}, ${phone}, ${refresh_token})
    RETURNING id, full_name, phone, role
    `;

    const access_token = await createAccessToken(refresh_token);

    return ApiResponse(
      res,
      201,
      { ...newUser, refresh_token, access_token },
      "User signed up successfully"
    );
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  } finally {
    await sql`DELETE FROM user_otps WHERE phone = ${phone}`;
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name } = req.body || {};
  if (!id || !full_name)
    return ApiResponse(res, 400, null, "Missing id or full_name");

  try {
    const [result] = await sql`
      UPDATE users SET full_name = ${full_name}
      WHERE id = ${id}
      RETURNING id, full_name
    `;
    if (!result) return ApiResponse(res, 404, null, "User not found");
    return ApiResponse(res, 200, result, "User updated");
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse(res, 400, null, "Missing user id");

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return ApiResponse(res, 200, null, "User deleted successfully");
  } catch (error) {
    return ApiResponse(res, 500, null, error.message);
  }
};
