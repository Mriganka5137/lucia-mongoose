import { NewPasswordForm } from "@/components/auth/new-password-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NewPasswordPage = async () => {
  const { session } = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return <NewPasswordForm />;
};

export default NewPasswordPage;
