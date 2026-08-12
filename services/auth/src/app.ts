import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import errorHandler from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* =====================================================
   CORS
===================================================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* =====================================================
   SECURITY / PERFORMANCE
===================================================== */

app.use(helmet());
app.use(compression());

/* =====================================================
   LOGGING
===================================================== */

morgan.token("time", (_req, res) => {
  return `${res.getHeader("X-Response-Time") || ""}`;
});

app.use(morgan(":method :url :status :response-time ms"));

/* =====================================================
   BODY PARSERS
===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   COOKIES
===================================================== */

app.use(cookieParser());

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service is running 🚀",
  });
});

/* =====================================================
   ROUTES
===================================================== */

app.use("/api/v1/auth", authRoutes);

/* =====================================================
   ERROR HANDLING
===================================================== */

app.use(notFound);
app.use(errorHandler);

export default app;