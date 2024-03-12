import db from "@/lib/db";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "./data/verificationToken";
import { EmailVerification } from "@/lib/models/email-verification.model";
import { getPasswordResetTokenByEmail } from "./data/password-reset-token";
import { PasswordResetToken } from "@/lib/models/password-reset-token.model";
// verification token
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await EmailVerification.findByIdAndDelete(existingToken._id);
  }

  const verficationToken = await EmailVerification.create({
    email,
    token,
    expires,
  });

  return verficationToken;
};

// password reset token
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await PasswordResetToken.findByIdAndDelete(existingToken._id);
  }

  const passwordResetToken = await PasswordResetToken.create({
    email,
    token,
    expires,
  });

  return passwordResetToken;
};

// // generate two factor token

// export const generateTwoFactorToken = async (email: string) => {
//   const token = crypto.randomInt(100_000, 1_000_000).toString(); // 6 digit number
//   const expires = new Date(new Date().getTime() + 5 * 60 * 1000); //  5 minutes

//   const existingToken = await getTwoFactorTokenByEmail(email);

//   if (existingToken) {
//     await db.twoFactorToken.delete({
//       where: {
//         id: existingToken.id,
//       },
//     });
//   }

//   const twoFactorToken = await db.twoFactorToken.create({
//     data: {
//       email,
//       token,
//       expires,
//     },
//   });

//   return twoFactorToken;
// };
