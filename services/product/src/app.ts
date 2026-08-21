import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import collectionRoutes from "./routes/collection.routes.js";

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

app.use(
  morgan(":method :url :status :response-time ms"),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());



app.use(
  "/api/v1/products",
  productRoutes,
);

app.use(
  "/api/v1/categories",
  categoryRoutes,
);

app.use(
  "/api/v1/collections",
  collectionRoutes,
);



app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Service is running 🚀",
  });
});



app.use(errorHandler);

export default app;