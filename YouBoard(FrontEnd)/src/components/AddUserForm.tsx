import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getSchemaByStep from "../utils/getSchemaByStep";
import { FormValues } from "../types";
import api from "../api/axios";
import { toast } from "sonner";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import NameInput from "./NameInput";
import NextButton from "./NextButton";
import FormContainer from "./FormContainer";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const AddUserForm = () => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    trigger,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getSchemaByStep(step === 3 ? step + 1 : step)),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    mode: "onChange",
  });

  const handleNextButton = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    const [email, password, name] = watch(["email", "password", "name"]);

    if (step === 1) {
      try {
        setIsVerifying(true);

        await api.get(`/admin/check-user-email`, {
          params: {
            email,
          },
        });

        setStep((prev) => prev + 1);
      } catch (error) {
        if (isAxiosError(error)) {
          setError("email", {
            type: "manual",
            message: error.response?.data.message,
          });
        }

        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }

    if (step === 2) {
      try {
        setIsVerifying(true);

        await api.put("/admin/store-user-password", { email, password });

        setStep((prev) => prev + 1);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message, {
            id: "toast",
          });
        }

        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }

    if (step === 3) {
      try {
        setIsVerifying(true);

        const res = await api.post("/admin/user-signup", { email, name });

        navigate("/admin/dashboard");

        toast.success(res.data.message, {
          id: "toast",
        });
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message, {
            id: "toast",
          });
        }

        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-start relative z-10 px-4 overflow-hidden">
      <FormContainer
        title="add user!"
        step={step}
        totalSteps={3}
        Inputs={
          <>
            {step === 1 && (
              <EmailInput title="signup" register={register} errors={errors} />
            )}
            {step === 2 && (
              <PasswordInput
                title="signup"
                register={register}
                errors={errors}
              />
            )}
            {step === 3 && <NameInput register={register} errors={errors} />}
          </>
        }
        NextButton={
          <NextButton
            isVerifying={isVerifying}
            handleNextButton={handleNextButton}
            step={step}
            totalStep={3}
            text="Add"
          />
        }
        handleNextButton={handleNextButton}
      />
    </main>
  );
};

export default AddUserForm;
