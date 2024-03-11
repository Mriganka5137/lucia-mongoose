"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/actions/auth.action";
import { IoIosLogOut } from "react-icons/io";
const LogoutButton = () => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        signOut();
      }}
      className="flex items-center gap-2 w-full justify-start p-0 h-fit text-xs text-secondary-foreground/50 cursor-pointer font-normal"
    >
      <IoIosLogOut className="size-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
