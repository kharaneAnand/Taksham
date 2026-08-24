import express from "express";

import cors from "cors";

import helmet from "helmet";

import compression from "compression";

import morgan from "morgan";

import mediaRoutes from "./routes/media.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import notFound from "./middleware/notFound.middleware.js";
import notificationRoutes from "./routes/notification.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Media Service is running",
  });
});

app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/offers",offerRoutes,);
app.use("/api/v1/coupons",couponRoutes,);
app.use(
  "/api/v1/notifications",
  notificationRoutes,
);
app.use(notFound);

app.use(errorHandler);

export default app;