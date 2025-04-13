import jwt from "jsonwebtoken";
import { sql } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const access_token = req.header("Authorization")?.replace("Bearer ", "");

      if (!access_token) {
        return ApiResponse(res, 401, null, "Unauthorized: Missing 'access_token'");
      }

      const decodedInfo = jwt.verify(access_token, SECRET_KEY, {
        algorithms: ["HS256"],
      });

      const [user] = await sql`
        SELECT id, full_name, phone, role
        FROM users
        WHERE id = ${decodedInfo.user_id}
        AND phone = ${decodedInfo.phone}
      `;

      if (!user) {
        return ApiResponse(res, 401, null, "Invalid 'access_token'");
      }

      if (!allowedRoles.includes(user.role)) {
        return ApiResponse(res, 403, null, "Forbidden: Access denied");
      }

      req.user = user;
      next();
    } catch (error) {
      return ApiResponse(res, 401, null, error.message || "Invalid 'access_token'");
    }
  };
};

export const verifyUserToken = verifyToken(["user", "developer"]);
export const verifyAdminToken = verifyToken(["admin", "developer"]);
