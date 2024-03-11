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
      <DropdownMenuContent align="end" className="w-[300px] p-5">
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
        <div className="space-y-2">
          <DropdownMenuItem>Manage Account</DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
