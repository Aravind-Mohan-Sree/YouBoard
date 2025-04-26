import { useEffect, useRef, useState } from "react";
import { InputProps } from "../types";
import { Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";

const PasswordInput = ({ title, role, register, errors }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <div className="relative w-full">
        <input
          {...register?.("password")}
          ref={(e) => {
            register?.("password").ref(e);
            inputRef.current = e;
          }}
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className="w-full px-4 py-3 bg-gray-700 border-2 border-white text-white rounded-full focus:outline-none pr-12"
        />
        <button
          type="button"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {!showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {title === "signin" && errors?.password?.type === "manual" && (
        <small className="text-red-500">{errors?.password.message}</small>
      )}
      {title === "signup" && errors?.password && (
        <small className="text-red-500">{errors?.password.message}</small>
      )}
      {title === "signin" && role === "user" && (
        <Link
          to={"/forgot-password"}
          className="text-gray-400 text-sm hover:text-white transition-colors underline hover:no-underline text-center w-fit mx-auto block mt-5"
        >
          forgot password
        </Link>
      )}
    </>
  );
};

export default PasswordInput;
