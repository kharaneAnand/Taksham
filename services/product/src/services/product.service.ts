import ApiError from "../helpers/ApiError.js";
import Product from "../models/product.model.js";

import type {
  CreateProductInput,UpdateProductInput
} from "../validators/product.validator.js";

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
  async getProducts() {
    const products =
      await Product.find().sort({
        createdAt: -1,
      });

    return products;
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