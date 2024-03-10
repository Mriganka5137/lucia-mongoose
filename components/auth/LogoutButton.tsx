"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/actions/auth.action";

const LogoutButton = () => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
