import { Document, Schema, model, models } from "mongoose";

export interface IEMailVerification extends Document {
  email: string;
  token: string;
  expires: Date;
}

const EMailVerificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const EmailVerification =
  models.EMailVerification ||
  model("EMailVerification", EMailVerificationSchema);
