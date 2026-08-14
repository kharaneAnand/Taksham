import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();



app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Cart service is healthy",
  });
});


app.use(
  "/api/v1/cart",
  cartRoutes,
);


app.use(errorHandler);

export default app;