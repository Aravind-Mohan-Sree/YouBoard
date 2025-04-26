import { useEffect, useRef } from "react";
import { InputProps } from "../types";

const EmailInput = ({ title, register, errors }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <input
        {...register?.("email")}
        ref={(e) => {
          register?.("email").ref(e);
          inputRef.current = e;
        }}
        type="text"
        placeholder="Enter email"
        className="w-full px-4 py-3 bg-gray-700 border-2 border-white text-white rounded-full focus:outline-none"
      />
      {title === "signin" && errors?.email?.type === "manual" && (
        <small className="text-red-500">{errors?.email.message}</small>
      )}
      {title === "signup" && errors?.email && (
        <small className="text-red-500">{errors?.email.message}</small>
      )}
    </>
  );
};

export default EmailInput;
