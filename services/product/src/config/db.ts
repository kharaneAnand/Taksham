import mongoose from "mongoose";

import env from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    if (!env.MONGODB_URI) {
      throw new Error(
        "MONGO_URI is not defined",
      );
    }

    await mongoose.connect(env.MONGODB_URI);

    console.log(
      "MongoDB Connected Successfully",
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error,
    );

    process.exit(1);
  }
};

export default connectDB;