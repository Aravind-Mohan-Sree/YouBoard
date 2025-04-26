import { useEffect, useRef } from "react";
import { InputProps } from "../types";

const NameInput = ({ register, errors }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <input
        {...register?.("name")}
        ref={(e) => {
          register?.("name").ref(e);
          inputRef.current = e;
        }}
        type="text"
        placeholder="Enter name"
        className="w-full px-4 py-3 bg-gray-700 border-2 border-white text-white rounded-full focus:outline-none"
      />
      {errors?.name && (
        <small className="text-red-500">{errors?.name.message}</small>
      )}
    </>
  );
};

export default NameInput;
