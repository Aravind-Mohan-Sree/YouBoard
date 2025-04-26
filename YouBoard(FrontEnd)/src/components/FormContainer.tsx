import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
import { FormContainerProps } from "../types";

const FormContainer = ({
  title,
  step,
  totalSteps,
  Inputs,
  handleNextButton,
  NextButton,
}: FormContainerProps) => {
  return (
    <motion.div
      className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm flex flex-col items-center"
      key={step}
      initial={{ x: "30%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mb-6">
        <CircleUserRound className="text-white" size={50} />
      </div>

      <h1 className="text-white text-2xl font-bold mb-6 uppercase">{title}</h1>

      <form
        className="w-full"
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleNextButton();
          }
        }}
      >
        <span className="text-white text-xs text-center block mb-3">
          Step {step} of {totalSteps}
        </span>
        <div className="w-full">{Inputs}</div>

        <div className="flex flex-col items-center gap-4">{NextButton}</div>
      </form>
    </motion.div>
  );
};

export default FormContainer;
