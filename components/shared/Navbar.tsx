import React from "react";
import ProfileButton from "../auth/profile-button";

const Navbar = () => {
  return (
    <div className=" w-full h-20 border-b border-primary/20  p-5  ">
      <div className=" w-full container flex justify-end ">
        <ProfileButton />
      </div>
    </div>
  );
};

export default Navbar;
