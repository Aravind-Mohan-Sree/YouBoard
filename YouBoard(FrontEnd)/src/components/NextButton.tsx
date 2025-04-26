import { ChevronRight, Loader2 } from "lucide-react";
import { NextButtonProps } from "../types";

const NextButton = ({
  isVerifying,
  handleNextButton,
  step,
  totalStep,
  text,
}: NextButtonProps) => {
  return (
    <button
      type="button"
      disabled={isVerifying ? true : false}
      className={`mt-6 px-6 py-2 transition-colors text-white rounded-full font-medium flex items-center justify-center ${
        isVerifying
          ? "cursor-not-allowed bg-blue-800"
          : "cursor-pointer bg-blue-600 hover:bg-blue-800"
      }`}
      onClick={() => handleNextButton()}
    >
      {isVerifying ? "Wait" : step === totalStep ? text : "Next"}
      <span
        className={`${step !== totalStep ? "ml-2" : ""} ${
          isVerifying ? "animate-spin ml-2" : ""
        }`}
      >
        {isVerifying ? (
          <Loader2 size={17} />
        ) : step !== totalStep ? (
          <ChevronRight size={17} />
        ) : (
          ""
        )}
      </span>
    </button>
  );
};

export default NextButton;
