import mongoose, { Document, Types } from "mongoose";

export enum TokenType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export interface IUserToken extends Document {
  userId: Types.ObjectId;
  token: string;
  type: TokenType;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userTokenSchema = new mongoose.Schema<IUserToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(TokenType),
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired tokens
userTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

// Ensure only one token of a given type exists per user
userTokenSchema.index(
  {
    userId: 1,
    type: 1,
  },
  {
    unique: true,
  }
);

const UserToken = mongoose.model<IUserToken>(
  "UserToken",
  userTokenSchema
);

export default UserToken;