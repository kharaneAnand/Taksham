import cloudinary from "./config/cloudinary.js";
import env from "./config/env.js";

console.log("Cloud Name:", env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", env.CLOUDINARY_API_KEY);
console.log("Secret Exists:", !!env.CLOUDINARY_API_SECRET);

async function test() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );

    console.log(result.secure_url);
  } catch (err) {
    console.error(err);
  }
}

test();