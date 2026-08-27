import app from "./app.js";

import env from "./config/env.js";

import cloudinary from "./config/cloudinary.js";

import connectDB from "./config/db.js";

/*
 * ========================================
 * START SERVER
 * ========================================
 */

const startServer =
  async (): Promise<void> => {
    try {
      /*
       * ------------------------------------
       * Connect MongoDB
       * ------------------------------------
       */

      await connectDB();

      console.log(
        "MongoDB connected",
      );

      /*
       * ------------------------------------
       * Check Cloudinary Connection
       * ------------------------------------
       */

      await cloudinary.api.ping();

      console.log(
        "Cloudinary connected",
      );

      /*
       * ------------------------------------
       * Start Express Server
       * ------------------------------------
       */

      app.listen(
        env.PORT,
        () => {
          console.log(
            `Utils Service running on port ${env.PORT}`,
          );
        },
      );
    } catch (error) {
      console.error(
        "Failed to start Utils Service:",
        error,
      );

      process.exit(1);
    }
  };

void startServer();