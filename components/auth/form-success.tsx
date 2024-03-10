import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
interface Props {
  message?: string;
}
export const FormSuccess = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className=" flex items-center gap-x-2 bg-emerald-500/15 p-3 rounded-md text-sm text-emerald-500 ">
      <FaCheckCircle className=" h-4 w-4" />
      <p className=" ">{message}</p>
    </div>
  );
};
