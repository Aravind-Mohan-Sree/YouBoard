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
import EmailVerification from "./EmailVerification";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
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
    const isValid = await trigger("password");

    if (!isValid) return;

    const [email, password] = watch(["email", "password"]);

    if (step === 1) {
      try {
        setIsVerifying(true);

        await api
          .get(`/check-email`, {
            params: {
              entry: "signin",
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
              message: "Email not exists",
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

        await api
          .put("/reset-password", {
            email,
            password,
          })
          .then((res) => {
            toast.success(res.data.message, {
              id: "toast",
            });

            navigate("/signin");
          })
          .catch((err) => {
            toast.error(err.response?.data.message, {
              id: "toast",
            });
          });
      } catch (error) {
        console.log(error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-start relative z-10 px-4 overflow-hidden">
      <FormContainer
        title="Forgot Password!"
        step={step}
        totalSteps={3}
        Inputs={
          <>
            {step === 1 && (
              <EmailInput title="signin" register={register} errors={errors} />
            )}
            {step === 2 && <EmailVerification watch={watch} />}
            {step === 3 && (
              <PasswordInput
                title="signup"
                register={register}
                errors={errors}
              />
            )}
          </>
        }
        NextButton={
          step !== 2 && (
            <NextButton
              isVerifying={isVerifying}
              handleNextButton={handleNextButton}
              step={step}
              totalStep={3}
              text="Update"
            />
          )
        }
        handleNextButton={handleNextButton}
      />
    </main>
  );
};

export default ForgotPasswordForm;
