import mongoose from "mongoose";

import app from "./app.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    /*
     * ----------------------------------------
     * MongoDB
     * ----------------------------------------
     */

    await mongoose.connect(
      env.MONGO_URI,
    );

    console.log(
      "MongoDB Connected Successfully",
    );

    /*
     * ----------------------------------------
     * Start Server
     * ----------------------------------------
     */

    app.listen(
      env.PORT,
      () => {
        console.log(
          `Order service is running on port ${env.PORT}`,
        );
      },
    );
  } catch (error) {
    console.error(
      "Failed to start Order service:",
      error,
    );

    process.exit(1);
  }
};

startServer();