import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { sql } from "../db/index.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * 🆕 Create a New Refresh Token
 */
export async function createRefreshToken() {
  const refresh_token = randomBytes(64).toString("hex");

  return refresh_token;
}

/**
 * 🔑 Create an Access Token
 */
export async function createAccessToken(refresh_token) {
  const [result] = await sql`
    SELECT id, full_name, phone, refresh_token FROM users
    WHERE refresh_token = ${refresh_token}
  `;

  if (!result) return null;

  const access_token = jwt.sign(
    { user_id: result.id, full_name: result.full_name, phone: result.phone },
    SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "3h",
    }
  );

  await sql`
    UPDATE users
    SET access_token = ${access_token}
    WHERE id = ${result.id}
  `;

  return access_token;
}

/**
 * ✅ Refresh Access Token
 */
export async function refreshAccessToken({ refresh_token }) {
  return await createAccessToken({ refresh_token });
}
