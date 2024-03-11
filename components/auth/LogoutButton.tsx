"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/actions/auth.action";
import { CiLogout } from "react-icons/ci";
const LogoutButton = () => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        signOut();
      }}
      className="flex items-center gap-2 w-full justify-start p-0 h-fit"
    >
      Logout
      <CiLogout />
    </Button>
  );
};

export default LogoutButton;
