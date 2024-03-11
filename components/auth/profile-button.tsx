import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogoutButton from "./LogoutButton";
import { IUser } from "@/lib/models/user.model";
import { GoPersonFill } from "react-icons/go";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";
import Link from "next/link";

interface ProfileButtonProps {
  user: IUser;
}

const ProfileButton = ({ user }: ProfileButtonProps) => {
  console.log(user, "user");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.profilePictureUrl && user.profilePictureUrl} />
          <AvatarFallback className=" bg-primary/80">
            <GoPersonFill className="size-5 " />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[300px] p-5">
        <DropdownMenuLabel className="flex gap-2">
          <div>
            <Avatar>
              <AvatarImage
                src={user.profilePictureUrl && user.profilePictureUrl}
              />
              <AvatarFallback className=" bg-primary/80">
                <GoPersonFill className="size-5 " />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-sm font-bold capitalize">{user.name}</h3>
            <p className="text-xs text-primary ">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-2 pb-5 mt-3">
          <DropdownMenuItem className=" ">
            <Link
              href="/manage-account"
              className="flex items-center gap-3 text-secondary-foreground/50 cursor-pointer hover:text-secondary-foreground"
            >
              <IoMdSettings className="" />
              Manage Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className=" flex items-center gap-3 text-secondary-foreground/50 cursor-pointer">
            <LogoutButton />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
