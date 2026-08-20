import "dotenv/config";

import mongoose from "mongoose";

import Category from "../models/category.model.js";

const categories = [
  {
    name: "Furniture",
    slug: "furniture",
    subcategories: [
      {
        name: "Sofa",
        slug: "sofa",
      },
      {
        name: "Chair",
        slug: "chair",
      },
      {
        name: "Table",
        slug: "table",
      },
      {
        name: "Bed",
        slug: "bed",
      },
      {
        name: "Storage",
        slug: "storage",
      },
      {
        name: "Desk",
        slug: "desk",
      },
    ],
  },

  {
    name: "Lighting",
    slug: "lighting",
    subcategories: [
      {
        name: "Ceiling Light",
        slug: "ceiling-light",
      },
      {
        name: "Table Lamp",
        slug: "table-lamp",
      },
      {
        name: "Floor Lamp",
        slug: "floor-lamp",
      },
      {
        name: "Wall Light",
        slug: "wall-light",
      },
    ],
  },

  {
    name: "Decor",
    slug: "decor",
    subcategories: [
      {
        name: "Wall Decor",
        slug: "wall-decor",
      },
      {
        name: "Mirror",
        slug: "mirror",
      },
      {
        name: "Vase",
        slug: "vase",
      },
      {
        name: "Clock",
        slug: "clock",
      },
      {
        name: "Decorative Object",
        slug: "decorative-object",
      },
    ],
  },

  {
    name: "Rugs",
    slug: "rugs",
    subcategories: [
      {
        name: "Living Room Rug",
        slug: "living-room-rug",
      },
      {
        name: "Bedroom Rug",
        slug: "bedroom-rug",
      },
      {
        name: "Runner Rug",
        slug: "runner-rug",
      },
    ],
  },
];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment",
      );
    }

    await mongoose.connect(mongoUri);

    console.log(
      "MongoDB connected successfully",
    );

    for (const category of categories) {
      await Category.findOneAndUpdate(
        {
          slug: category.slug,
        },
        {
          $set: category,
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        },
      );

      console.log(
        `Seeded category: ${category.name}`,
      );
    }

    console.log(
      "All categories seeded successfully",
    );
  } catch (error) {
    console.error(
      "Category seeding failed:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();