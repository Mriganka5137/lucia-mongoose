"use server";

import { SignInSchema, SignUpSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";

import { lucia, auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/models/user.model";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const validateData = SignUpSchema.safeParse(values);
  if (!validateData.success) {
    return { error: "Invalid data" };
  }

  const { email, password, name } = validateData.data;

  connectDB();

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return { error: "Email already exists" };
  }

  try {
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      name,
    });

    const session = await lucia.createSession(user._id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: "Account created successfully",
      data: {
        userId: user._id,
      },
    };
  } catch (error) {
    return {
      error: "Something went wrong here!",
    };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const validateData = SignInSchema.safeParse(values);
  if (!validateData.success) {
    return { error: "Invalid data" };
  }

  const existingUser = await User.findOne({
    email: validateData.data.email,
  });

  if (!existingUser) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.password) {
    return { error: "Invalid credentials" };
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
