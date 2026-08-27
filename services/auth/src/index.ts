import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(
      env.PORT,
      () => {
        console.log(
          `Auth service running on port ${env.PORT} in ${env.NODE_ENV} mode`,
        );
      },
    );

    server.on(
      "error",
      (error) => {
        console.error(
          "Server error:",
          error,
        );

        process.exit(1);
      },
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  }
};

startServer();