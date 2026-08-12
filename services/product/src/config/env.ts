import "dotenv/config";

const env = {
  PORT: Number(process.env.PORT) || 5002,

  MONGODB_URI: process.env.MONGODB_URI || "",

  NODE_ENV:
    process.env.NODE_ENV || "development",
};

export default env;