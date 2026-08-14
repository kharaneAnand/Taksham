import ApiError from "../helpers/ApiError.js";
import Product from "../models/product.model.js";

import type {
  CreateProductInput,UpdateProductInput
} from "../validators/product.validator.js";

interface GetProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  room?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(
    data: CreateProductInput,
  ) {
    const existingProduct =
      await Product.findOne({
        slug: data.slug,
      });

    if (existingProduct) {
      throw new ApiError(
        409,
        "Product with this slug already exists",
      );
    }

    const product =
      await Product.create(data);

    return product;
  }

  /**
   * Get all products
   */


async getProducts({
  page = 1,
  limit = 12,
  search,
  category,
  subcategory,
  room,
  material,
  color,
  minPrice,
  maxPrice,
  sort,
}: GetProductsOptions) {
  const filter: Record<string, any> = {};

  // -----------------------------
  // Search
  // -----------------------------

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
      {
        subcategory: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // -----------------------------
  // Category
  // -----------------------------

  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: "i",
    };
  }

  // -----------------------------
  // Subcategory
  // -----------------------------

  if (subcategory) {
    filter.subcategory = {
      $regex: `^${subcategory}$`,
      $options: "i",
    };
  }

  // -----------------------------
  // Room
  // -----------------------------

  if (room) {
    filter.room = {
      $regex: `^${room}$`,
      $options: "i",
    };
  }

  // -----------------------------
  // Material
  // -----------------------------

  if (material) {
    filter.material = {
      $regex: `^${material}$`,
      $options: "i",
    };
  }

  // -----------------------------
  // Color
  // -----------------------------

  if (color) {
    filter.colors = {
      $regex: color,
      $options: "i",
    };
  }

  // -----------------------------
  // Price Range
  // -----------------------------

  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }

  // -----------------------------
  // Sorting
  // -----------------------------

  let sortOption: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  switch (sort) {
    case "price_asc":
      sortOption = {
        price: 1,
      };
      break;

    case "price_desc":
      sortOption = {
        price: -1,
      };
      break;

    case "rating":
      sortOption = {
        rating: -1,
      };
      break;

    case "newest":
      sortOption = {
        createdAt: -1,
      };
      break;

    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    case "popular":
      sortOption = {
        reviews: -1,
      };
      break;
  }

  // -----------------------------
  // Pagination
  // -----------------------------

  const skip = (page - 1) * limit;

  const [products, totalProducts] =
    await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

  const totalPages =
    Math.ceil(totalProducts / limit);

  return {
    products,

    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

  /**
   * Get product by slug
   */
  async getProductBySlug(
    slug: string,
  ) {
    const product =
      await Product.findOne({ slug });

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    return product;
  }

  async getProductById(id: string) {
  const product =
    await Product.findById(id);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
    );
  }

  return product;
}

  async updateProduct(
  id: string,
  data: UpdateProductInput,
) {
  const product =
    await Product.findById(id);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
    );
  }

  if (
    data.slug &&
    data.slug !== product.slug
  ) {
    const existingProduct =
      await Product.findOne({
        slug: data.slug,
      });

    if (existingProduct) {
      throw new ApiError(
        409,
        "Product with this slug already exists",
      );
    }
  }

  Object.assign(product, data);

  await product.save();

  return product;
}

async deleteProduct(id: string) {
  const product =
    await Product.findById(id);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
    );
  }

  await Product.findByIdAndDelete(id);

  return product;
}

}

export default new ProductService();