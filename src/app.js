import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.routes.js";
// import paymentRouter from "./routes/payment.routes.js";
// import appRouter from "./routes/app.routes.js";
import { ApiResponse } from "./utils/ApiResponse.js";
/** Configurations */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Middlewares */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

/** CORS Middleware */
app.use((req, res, next) => {
  const isApiRoute = req.path.startsWith("/api");

  if (isApiRoute) {
    res.setHeader("Access-Control-Allow-Origin", "*");
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

    return next();
  }

  if (!isApiRoute) {
    return ApiResponse(res, 403, null, "Forbidden: Access denied");
  }

  next();
});

app.get("/api", (req, res) => {
  return ApiResponse(res, 200, null, "RFP API is live");
});

app.get("/api/v1", (req, res) => {
  return ApiResponse(res, 200, null, "Allowed: Access approved");
});

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/payments", paymentRouter);
// app.use("/api/v1/app", appRouter);

export { app };
