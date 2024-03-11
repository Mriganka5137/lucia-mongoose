import { Schema, model, models } from "mongoose";

export interface IOauthAccount {
  userId: Schema.Types.ObjectId;
  provider: string;
  email: string;
  providerUserId: string;
  accessToken: string;
  refreshToken?: string | null;
  expires_at?: Date;
}

const oauthAccountSchema = new Schema<IOauthAccount>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    email: { type: String, required: true },
    provider: { type: String, required: true },
    providerUserId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expires_at: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const OAuthAccount =
  models.OauthAccount || model("OauthAccount", oauthAccountSchema);
