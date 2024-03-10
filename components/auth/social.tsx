"use client";
import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // const signInOAuth = async (provider: "github" | "google") => {
  //   supabase.auth.signInWithOAuth({
  //     provider,
  //     options: {
  //       redirectTo: `${location.origin}` + "/auth/callback",
  //     },
  //   });
  // };

  return (
    <div className=" w-full flex gap-x-2 items-center">
      <Button
        size="lg"
        variant="outline"
        onClick={() => {}}
        className=" w-full"
      >
        <FcGoogle className=" w-6 h-6" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => {}}
        className=" w-full"
      >
        <FaGithub className=" w-6 h-6" />
      </Button>
    </div>
  );
};
