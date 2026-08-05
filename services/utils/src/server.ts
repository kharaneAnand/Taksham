import app from "./app.js";
import env from "./config/env.js";
import cloudinary from "./config/cloudinary.js";

const startServer = async (): Promise<void> => {
  try {
    // Check Cloudinary Connection
    const result = await cloudinary.api.ping();

    console.log("✅ Cloudinary Connected");
    console.log(result);

    // Start Express Server
    app.listen(env.PORT, () => {
      console.log(`utils service is running on the ${env.PORT}`)
    });

  } catch (error) {
    console.error("Failed to start Utils Service");
    console.error(error);
    process.exit(1);
  }
};

startServer();