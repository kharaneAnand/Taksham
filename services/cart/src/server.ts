import mongoose from "mongoose";

import app from "./app.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await mongoose.connect(
      env.MONGODB_URI,
    );

    console.log(
      "MongoDB Connected Successfully",
    );

    app.listen(env.PORT, () => {
      console.log(
        `Cart service is running on port ${env.PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Cart service:",
      error,
    );

    process.exit(1);
  }
};

startServer();