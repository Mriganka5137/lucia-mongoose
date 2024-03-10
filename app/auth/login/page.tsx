import { LogInForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const LogInPage = async () => {
  const { session } = await auth();
  if (session) {
    return redirect("/dashboard");
  }
  return <LogInForm />;
};

export default LogInPage;
