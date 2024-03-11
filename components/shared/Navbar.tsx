import React from "react";
import ProfileButton from "../auth/profile-button";
import { auth } from "@/lib/auth";
import { User } from "@/lib/models/user.model";

const Navbar = async () => {
  const { user } = await auth();
  const userInfo = await User.findById(user?.id);

  return (
    <div className=" w-full h-20 border-b border-primary/20  p-5  ">
      <div className=" w-full container flex justify-end ">
        {userInfo && <ProfileButton user={userInfo} />}
      </div>
    </div>
  );
};

export default Navbar;
