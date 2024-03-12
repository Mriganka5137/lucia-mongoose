import { ResetForm } from "@/components/auth/reset-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const ResetPasswordPage = async () => {
  return <ResetForm />;
};

export default ResetPasswordPage;
