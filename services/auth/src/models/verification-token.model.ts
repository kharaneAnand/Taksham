import mongoose, { Document, Types } from "mongoose";

export interface IVerificationToken extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const verificationTokenSchema =
  new mongoose.Schema<IVerificationToken>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      token: {
        type: String,
        required: true,
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

verificationTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

const VerificationToken =
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    verificationTokenSchema
  );

export default VerificationToken;