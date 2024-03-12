import { auth } from "@/lib/auth";
import ProfileButton from "../auth/profile-button";

const Navbar = async () => {
  const { session } = await auth();

  return (
    <div className=" w-full h-20 border-b border-primary/20  p-5  ">
      <div className=" w-full container flex justify-end ">
        {session && <ProfileButton />}
      </div>
    </div>
  );
};

export default Navbar;
