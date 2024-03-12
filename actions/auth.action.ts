"use server";

import {
  NewPasswordSchema,
  ResetSchema,
  SignInSchema,
  SignUpSchema,
} from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { lucia, auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/models/user.model";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/utils/tokens";
import { sendPasswordResetmail, sendVerificationEmail } from "@/utils/mail";
import { getUserByEmail } from "@/utils/data/user";
import { generateCodeVerifier, generateState } from "arctic";
import { github, google } from "@/lib/oauth";
import { getPasswordResetTokenByToken } from "@/utils/data/password-reset-token";
import db from "@/lib/db";
import { PasswordResetToken } from "@/lib/models/password-reset-token.model";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const validateData = SignUpSchema.safeParse(values);
  if (!validateData.success) {
    return { error: "Invalid data" };
  }

  const { email, password, name } = validateData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  await User.create({
    email,
    password: hashedPassword,
    name,
  });
  const verificationToken = await generateVerificationToken(email);
  // send mail
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    verifyEmail: "Confirmation email sent!",
  };
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const validateData = SignInSchema.safeParse(values);
  if (!validateData.success) {
    return { error: "Invalid data" };
  }
  const { email, password } = validateData.data;

  const existingUser = await User.findOne({
    email,
  });
  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  const isPasswordValid = await bcrypt.compare(
    validateData.data.password,
    existingUser.password
  );

  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  const session = await lucia.createSession(existingUser._id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: "Logged in Successfully",
  };
};

export const signOut = async () => {
  try {
    const { session } = await auth();
    if (!session) {
      return { error: "Unauthorized!" };
    }

    await lucia.invalidateSession(session.id);
    // await lucia.deleteExpiredSessions(); // cron job to delete expired sessions
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return { error: error?.message };
  }
};

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
export const createGithubAuthorizationURL = async () => {
  try {
    const state = generateState();

    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email not found!" };

  // 1. Generate a password reset token
  const passwordResetToken = await generatePasswordResetToken(email);

  // 2. Send the password reset email
  await sendPasswordResetmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent! Check your inbox!" };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  //   No token --> return error
  if (!token) {
    return { error: "Missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;
  const existsingToken = await getPasswordResetTokenByToken(token);
  if (!existsingToken) {
    return { error: "Invalid token" };
  }

  // if expired, return error
  const hasExpired = new Date(existsingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  //check if user exists
  const existingUser = await getUserByEmail(existsingToken.email);
  if (!existingUser) {
    return { error: "Email does not exists!" };
  }

  //   has password and update
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(existingUser._id, {
    password: hashedPassword,
  });
  //   delete token
  await PasswordResetToken.findByIdAndDelete(existsingToken._id);

  const session = await lucia.createSession(existingUser._id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { success: "Password updated" };
};
