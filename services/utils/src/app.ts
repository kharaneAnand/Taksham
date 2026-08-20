import express from "express";

import cors from "cors";

import helmet from "helmet";

import compression from "compression";

import morgan from "morgan";

import mediaRoutes from "./routes/media.routes.js";

import notFound from "./middleware/notFound.middleware.js";

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

app.use(notFound);

app.use(errorHandler);

export default app;