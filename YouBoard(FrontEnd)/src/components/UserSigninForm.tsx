import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getSchemaByStep from "../utils/getSchemaByStep";
import { FormValues } from "../types";
import api from "../api/axios";
import { toast } from "sonner";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import NextButton from "./NextButton";
import FormContainer from "./FormContainer";
import { useDispatch } from "react-redux";
import {
  setImageUrl,
  setIsAuthenticated,
  setName,
  setUserId,
} from "../store/authSlice";
import EntrySelector from "./EntrySelector";
import { isAxiosError } from "axios";

const UserSigninForm = () => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getSchemaByStep(step)),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    mode: "onChange",
  });

  const handleNextButton = async () => {
    const [email, password] = watch(["email", "password"]);

    if (step === 1) {
      try {
        setIsVerifying(true);

        await api.get(`/check-email`, {
          params: {
            entry: "signin",
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

        const res = await api.post(`/signin`, { email, password });

        dispatch(setIsAuthenticated(true));
        dispatch(setUserId(res.data.userId));
        dispatch(setName(res.data.name));
        dispatch(setImageUrl(res.data.imageUrl));

        toast.success("Signin successful", {
          id: "toast",
        });
      } catch (error) {
        if (isAxiosError(error)) {
          setError("password", {
            type: "manual",
            message: error.response?.data.message,
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
      <EntrySelector />
      <FormContainer
        title="welcome!"
        step={step}
        totalSteps={2}
        Inputs={
          <>
            {step === 1 && (
              <EmailInput title="signin" register={register} errors={errors} />
            )}
            {step === 2 && (
              <PasswordInput
                title="signin"
                role="user"
                register={register}
                errors={errors}
              />
            )}
          </>
        }
        NextButton={
          <NextButton
            isVerifying={isVerifying}
            handleNextButton={handleNextButton}
            step={step}
            totalStep={2}
            text="Signin"
          />
        }
        handleNextButton={handleNextButton}
      />
    </main>
  );
};

export default UserSigninForm;
