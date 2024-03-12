import { Schema, model, models } from "mongoose";

export interface IPasswordResetToken {
  email: string;
  token: string;
  expires: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
export const PasswordResetToken =
  models.PasswordResetToken ||
  model("PasswordResetToken", passwordResetTokenSchema);
