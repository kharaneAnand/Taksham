import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import env from "./config/env.js";

import errorHandler from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

if (
  env.NODE_ENV === "production"
) {
  app.set(
    "trust proxy",
    1,
  );
}

/* =====================================================
   CORS
===================================================== */

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

/* =====================================================
   SECURITY / PERFORMANCE
===================================================== */

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

/* =====================================================
   LOGGING
===================================================== */

if (
  env.NODE_ENV !==
  "production"
) {
  app.use(
    morgan(
      "dev",
    ),
  );
}

/* =====================================================
   BODY PARSERS
===================================================== */

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

/* =====================================================
   COOKIES
===================================================== */

app.use(
  cookieParser(),
);

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
  "/",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Auth Service is running",
    });
  },
);

/* =====================================================
   ROUTES
===================================================== */

app.use(
  "/api/v1/auth",
  authRoutes,
);

/* =====================================================
   ERROR HANDLING
===================================================== */

app.use(
  notFound,
);

app.use(
  errorHandler,
);

export default app;