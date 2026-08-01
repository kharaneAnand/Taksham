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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(compression()) ;

morgan.token("time", (req, res) => {
  return `${res.getHeader("X-Response-Time") || ""}`;
});

app.use(morgan(":method :url :status :response-time ms"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//routes 
app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service is running 🚀",
  });
});

export default app;