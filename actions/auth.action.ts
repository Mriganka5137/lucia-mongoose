"use server";

import { SignInSchema, SignUpSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { lucia, auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/models/user.model";
import { generateVerificationToken } from "@/utils/tokens";
import { sendVerificationEmail } from "@/utils/mail";
import { getUserByEmail } from "@/utils/data/user";

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
    success: "Confirmation email sent!",
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
