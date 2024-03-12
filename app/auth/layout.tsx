import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const { session } = await auth();
  if (session) {
    return redirect("/dashboard");
  }
  return (
    <div className=" h-full w-full bg-gradient flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
