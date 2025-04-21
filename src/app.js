import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.routes.js";
import menuRouter from "./routes/menu.routes.js";
import orderRouter from "./routes/order.routes.js";

import { ApiResponse } from "./utils/ApiResponse.js";
/** Configurations */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Middlewares */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

/** List of allowed origins */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8100",
  "https://royalfoodplaza.vercel.app",
  "https://royalfoodplaza.web.app",
  "https://app.rfp.com",
  "capacitor://app.rfp.com"
];

/** CORS Middleware */
app.use((req, res, next) => {
  const origin = req.get("Origin");
  const isApiRoute = req.path.startsWith("/api");

  if (isApiRoute && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  } else {
    return ApiResponse(res, 403, null, "Forbidden: Access denied");
  }
});

app.get("/api", (req, res) => {
  return ApiResponse(res, 200, null, "RFP API is live");
});

app.get("/api/v1", (req, res) => {
  return ApiResponse(res, 200, null, "Allowed: Access approved");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/orders", orderRouter);

export { app };
