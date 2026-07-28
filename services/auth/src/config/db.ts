import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

export default connectDB;