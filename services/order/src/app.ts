import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import env from "./config/env.js";

import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

/*
 * ========================================
 * TRUST PROXY
 * ========================================
 */

if (
  env.NODE_ENV === "production"
) {
  app.set(
    "trust proxy",
    1,
  );
}

/*
 * ========================================
 * CORS
 * ========================================
 */

const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:5173",
].filter(
  Boolean,
);

app.use(
  cors({
    origin: (
      origin,
      callback,
    ) => {
      /*
       * Allow requests without an Origin header.
       *
       * Examples:
       * - health checks
       * - server-to-server requests
       * - Postman during development
       */

      if (!origin) {
        return callback(
          null,
          true,
        );
      }

      if (
        allowedOrigins.includes(
          origin,
        )
      ) {
        return callback(
          null,
          true,
        );
      }

      return callback(
        new Error(
          "Not allowed by CORS",
        ),
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

/*
 * ========================================
 * SECURITY / PERFORMANCE
 * ========================================
 */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  compression(),
);

/*
 * ========================================
 * LOGGING
 * ========================================
 */

if (
  env.NODE_ENV !== "production"
) {
  app.use(
    morgan(
      "dev",
    ),
  );
}

/*
 * ========================================
 * BODY PARSERS
 * ========================================
 */

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  }),
);

/*
 * ========================================
 * COOKIES
 * ========================================
 */

app.use(
  cookieParser(),
);

/*
 * ========================================
 * HEALTH CHECK
 * ========================================
 */

app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Order service is healthy",
    });
  },
);

/*
 * ========================================
 * ROUTES
 * ========================================
 */

app.use(
  "/api/v1/orders",
  orderRoutes,
);

app.use(
  "/api/v1/payments",
  paymentRoutes,
);

/*
 * ========================================
 * ERROR HANDLING
 * ========================================
 */

app.use(
  errorHandler,
);

export default app;