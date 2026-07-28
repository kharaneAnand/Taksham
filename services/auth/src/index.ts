import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log("==================================");
      console.log("🚀 Auth Service Started");
      console.log(`🌍 Environment : ${env.NODE_ENV}`);
      console.log(`🚪 Port        : ${env.PORT}`);
      console.log("==================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();