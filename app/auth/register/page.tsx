import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const RegisterPage = async () => {
  const { session } = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
};

export default RegisterPage;
