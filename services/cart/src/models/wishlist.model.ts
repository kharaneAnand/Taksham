import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IWishlistItem {
  productId: string;
  addedAt: Date;
}

export interface IWishlist
  extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema =
  new Schema<IWishlistItem>(
    {
      productId: {
        type: String,
        required: true,
      },

      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: false,
    },
  );

const wishlistSchema =
  new Schema<IWishlist>(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      items: {
        type: [wishlistItemSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );

const Wishlist =
  mongoose.model<IWishlist>(
    "Wishlist",
    wishlistSchema,
  );

export default Wishlist;