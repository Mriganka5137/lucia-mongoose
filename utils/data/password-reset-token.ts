import db from "@/lib/db";
import { PasswordResetToken } from "@/lib/models/password-reset-token.model";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      token,
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await await PasswordResetToken.findOne({
      email,
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
