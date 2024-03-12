import { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  emailVerified: boolean;
  profilePictureUrl?: string;
  role: "user" | "admin";
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    profilePictureUrl: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
export const User = models.User || model("User", userSchema);
