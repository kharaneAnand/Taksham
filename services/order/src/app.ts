import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import orderRoutes from "./routes/order.routes.js" ;
import paymentRoutes from "./routes/payment.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

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

app.use(
  "/api/v1/orders",
  orderRoutes,
);
app.use(
  "/api/v1/payments",
  paymentRoutes,
);

app.use(errorHandler);

export default app;