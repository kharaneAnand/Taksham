import mongoose from "mongoose";

import env from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      env.MONGODB_URI,
    );

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host}`,
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed",
    );
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;