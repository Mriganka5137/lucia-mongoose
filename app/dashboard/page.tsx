import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const { session } = await auth();
  if (!session) {
    return redirect("/auth/login");
  }
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
