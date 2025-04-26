import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getSchemaByStep from "../utils/getSchemaByStep";
import { FormValues } from "../types";
import api from "../api/axios";
import { toast } from "sonner";
import EmailInput from "./EmailInput";
import EmailVerification from "./EmailVerification";
import PasswordInput from "./PasswordInput";
import NameInput from "./NameInput";
import NextButton from "./NextButton";
import FormContainer from "./FormContainer";
import { useNavigate } from "react-router-dom";
import EntrySelector from "./EntrySelector";

const SignupForm = () => {
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
    resolver: zodResolver(getSchemaByStep(step)),
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

        await api
          .get(`/check-email`, {
            params: {
              entry: "signup",
              email,
            },
          })
          .then(async () => {
            await api
              .put("/send-verification-email", { email })
              .then(async () => {
                setStep((prev) => prev + 1);

                const pollInterval = setInterval(async () => {
                  try {
                    const res = await api.delete(
                      `/check-verification-status/${email}`
                    );

                    if (res.data.verified) {
                      setStep((prev) => prev + 1);

                      toast.success("Email verified", {
                        id: "toast",
                      });

                      clearInterval(pollInterval);
                    }
                  } catch (error) {
                    toast.error("Verification email expired", {
                      id: "toast",
                    });

                    setStep((prev) => prev - 1);
                    clearInterval(pollInterval);
                    console.log(error);
                  }
                }, 3000);
              })
              .catch(() => {
                toast.error("Unable to send verification email", {
                  id: "toast",
                });
              });
          })
          .catch(() => {
            setError("email", {
              type: "manual",
              message: "Email already exists",
            });
          });
      } catch (error) {
        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }

    if (step === 3) {
      try {
        setIsVerifying(true);

        await api.put("/store-password", { email, password });

        setStep((prev) => prev + 1);
      } catch (error) {
        toast.error("Something went wrong", {
          id: "toast",
        });

        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }

    if (step === 4) {
      try {
        setIsVerifying(true);

        await api.post("/signup", { email, name });

        navigate("/signin");

        toast.success("Signup successful", {
          id: "toast",
        });
      } catch (error) {
        toast.error("Something went wrong", {
          id: "toast",
        });

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
        title="get started!"
        step={step}
        totalSteps={4}
        Inputs={
          <>
            {step === 1 && (
              <EmailInput title="signup" register={register} errors={errors} />
            )}
            {step === 2 && <EmailVerification watch={watch} />}
            {step === 3 && (
              <PasswordInput
                title="signup"
                register={register}
                errors={errors}
              />
            )}
            {step === 4 && <NameInput register={register} errors={errors} />}
          </>
        }
        NextButton={
          step !== 2 && (
            <NextButton
              isVerifying={isVerifying}
              handleNextButton={handleNextButton}
              step={step}
              totalStep={4}
              text="Signup"
            />
          )
        }
        handleNextButton={handleNextButton}
      />
    </main>
  );
};

export default SignupForm;
