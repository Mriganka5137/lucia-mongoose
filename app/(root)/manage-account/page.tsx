import { auth } from "@/lib/auth";
import { User } from "@/lib/models/user.model";
import { redirect } from "next/navigation";
import React from "react";

const ManageAccount = async () => {
  const { session, user } = await auth();
  if (!session) {
    return redirect("/auth/login");
  }

  const userInfo = await User.findById(user?.id);
  return (
    <div className=" max-w-5xl mx-auto p-5 ">
      <h1 className=" text-5xl">Account</h1>
      <h3 className=" mt-2 text-base text-secondary-foreground/60">
        Manage your account information
      </h3>
    </div>
  );
};

export default ManageAccount;
