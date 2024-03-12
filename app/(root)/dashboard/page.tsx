import { auth } from "@/lib/auth";
import { IUser, User } from "@/lib/models/user.model";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const { session, user } = await auth();
  if (!session) {
    return redirect("/auth/login");
  }

  const userData = await User.findById(user?.id);
  return (
    <div className=" max-w-5xl mx-auto p-5 space-y-5">
      <h1 className="text-3xl text-primary">Welcome</h1>
      <h1 className=" text-7xl   capitalize">{userData.name}</h1>
      <p className=" text-white">Role: {user?.role}</p>
    </div>
  );
};

export default Dashboard;
