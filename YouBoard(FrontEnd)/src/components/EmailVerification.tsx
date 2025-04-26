import { Loader2 } from "lucide-react";
import { InputProps } from "../types";

const EmailVerification = ({ watch }: InputProps) => {
  return (
    <>
      <Loader2 className="animate-spin text-white mx-auto my-5" size={40} />
      <p className="text-white text-center font-extralight">
        A verification email has been send to{" "}
        <span className="italic font-bold">{watch?.("email")}</span>. Kindly
        verify it and come back here.
      </p>
    </>
  );
};

export default EmailVerification;
