import db from "@/lib/db";
import { User } from "@/lib/models/user.model";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserByID = async (id: string) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    return null;
  }
};
