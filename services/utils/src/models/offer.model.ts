import {
  Schema,
  model,
  type Document,
  type Types,
} from "mongoose";

/* ========================================
 * TYPES
 * ======================================== */

export type DiscountType =
  | "percentage"
  | "fixed";

export type OfferScope =
  | "all"
  | "products"
  | "collections";

/* ========================================
 * OFFER DOCUMENT
 * ======================================== */

export interface IOffer extends Document {
  name: string;

  slug: string;

  description?: string;

  discountType: DiscountType;

  discountValue: number;

  appliesTo: OfferScope;

  productIds: Types.ObjectId[];

  collectionIds: Types.ObjectId[];

  startDate: Date;

  endDate: Date;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

/* ========================================
 * OFFER SCHEMA
 * ======================================== */

const offerSchema = new Schema<IOffer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    /* ====================================
     * DISCOUNT
     * ==================================== */

    discountType: {
      type: String,
      enum: [
        "percentage",
        "fixed",
      ],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ====================================
     * OFFER TARGET
     * ==================================== */

    appliesTo: {
      type: String,
      enum: [
        "all",
        "products",
        "collections",
      ],
      required: true,
      default: "all",
    },

    /*
     * Product IDs are stored here when
     * appliesTo = "products".
     */
    productIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },

    /*
     * Collection IDs are stored here when
     * appliesTo = "collections".
     */
    collectionIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Collection",
        },
      ],
      default: [],
    },

    /* ====================================
     * VALIDITY
     * ==================================== */

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* ========================================
 * INDEXES
 * ======================================== */


offerSchema.index({
  isActive: 1,
  startDate: 1,
  endDate: 1,
});

offerSchema.index({
  appliesTo: 1,
});

/* ========================================
 * VALIDATION
 * ======================================== */

offerSchema.pre(
  "validate",
  function () {
    /*
     * Percentage discount cannot exceed 100%.
     */
    if (
      this.discountType ===
        "percentage" &&
      this.discountValue > 100
    ) {
      this.invalidate(
        "discountValue",
        "Percentage discount cannot exceed 100",
      );
    }

    /*
     * End date must be after start date.
     */
    if (
      this.startDate &&
      this.endDate &&
      this.endDate <=
        this.startDate
    ) {
      this.invalidate(
        "endDate",
        "End date must be after start date",
      );
    }

    /*
     * Product offer must contain
     * at least one product.
     */
    if (
      this.appliesTo ===
        "products" &&
      this.productIds.length === 0
    ) {
      this.invalidate(
        "productIds",
        "Select at least one product",
      );
    }

    /*
     * Collection offer must contain
     * at least one collection.
     */
    if (
      this.appliesTo ===
        "collections" &&
      this.collectionIds.length === 0
    ) {
      this.invalidate(
        "collectionIds",
        "Select at least one collection",
      );
    }
  },
);

/* ========================================
 * MODEL
 * ======================================== */

const Offer =
  model<IOffer>(
    "Offer",
    offerSchema,
  );

export default Offer;