import { auth } from "@/lib/auth";
import ProfileButton from "../auth/profile-button";
import { BsChatSquareQuote } from "react-icons/bs";
import Link from "next/link";

const Navbar = async () => {
  const { session } = await auth();

  return (
    <div className=" w-full h-20 border-b border-primary/20  p-5  ">
      <div className=" w-full container flex justify-between items-center ">
        <Link href="/">
          <BsChatSquareQuote className="size-8 hover:text-primary cursor-pointer transition-colors duration-500 ease-in-out" />
        </Link>
        {session && <ProfileButton />}
      </div>
    </div>
  );
};

export default Navbar;
