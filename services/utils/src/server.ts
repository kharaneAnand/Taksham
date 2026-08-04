import cloudinary from "./config/cloudinary.js";

(async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("✅ Cloudinary Connected");

    console.log(result);
  } catch (error) {
    console.error("❌ Cloudinary Connection Failed");

    console.error(error);
  }
})();