import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import cartRoutes from "./routes/cart.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin:
      "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  express.json(),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  cookieParser(),
);

app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Cart service is healthy",
    });
  },
);

app.use(
  "/api/v1/cart",
  cartRoutes,
);

app.use(
  errorHandler,
);

export default app;