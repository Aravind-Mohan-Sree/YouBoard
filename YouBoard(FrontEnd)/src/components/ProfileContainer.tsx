import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, UserProps } from "../types";
import api from "../api/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import validationSchema from "../utils/validationSchema";
import { useDispatch } from "react-redux";
import { setImageUrl, setName } from "../store/authSlice";

const ProfileContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const dispatch = useDispatch();
  const {
    register,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      validationSchema.pick({ name: true, password: true }),
    ),
    mode: "onChange",
  });
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);

        const res = await api.get(`/get-user-info/${userId}`);
        const userData = res.data.user;
        setUser(userData);

        reset({
          name: userData.name,
          email: userData.email,
          currentPassword: "",
          password: "",
        });
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message, {
            id: "toast",
          });
        } else {
          toast.error("Something went wrong", {
            id: "toast",
          });
        }

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, reset]);

  const handleName = async () => {
    try {
      setIsLoading(true);

      const isValid = await trigger(["name"]);
      const currentName = watch("name");

      if (!isValid || currentName.trim() === user?.name) {
        setValue("name", user!.name);
        clearErrors("name");
        return;
      }

      const res = await api.put("/update-name", {
        userId,
        name: currentName,
      });

      setUser((prev) => ({
        ...prev!,
        name: res.data.name,
      }));

      setValue("name", res.data.name);
      dispatch(setName(res.data.name));

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          id: "toast",
        });
      } else {
        toast.error("Something went wrong", {
          id: "toast",
        });
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = async () => {
    try {
      setIsLoading(true);

      const isValid = await trigger(["password"]);

      if (!isValid) {
        return;
      }

      const [currentPassword, newPassword] = watch([
        "currentPassword",
        "password",
      ]);

      const res = await api.put("/change-password", {
        email: user?.email,
        currentPassword,
        newPassword,
      });

      setValue("currentPassword", "");
      setValue("password", "");

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        if (error.response?.status === 400) {
          setError("currentPassword", {
            type: "manual",
            message: data.message,
          });

          return;
        }

        toast.error(data.message, {
          id: "toast",
        });
      } else {
        toast.error("Something went wrong", {
          id: "toast",
        });
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (croppedBlob: Blob) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", croppedBlob);
      formData.append("userId", userId as string);

      const res = await api.post("/upload-image", formData);

      setUser((prev) => ({ ...prev!, imageUrl: res.data.imageUrl }));
      dispatch(setImageUrl(res.data.imageUrl));

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast.error(data.message, {
          id: "toast",
        });
      } else {
        toast.error("Something went wrong", {
          id: "toast",
        });
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRemove = async () => {
    try {
      setIsLoading(true);

      const res = await api.delete(`/remove-image/${userId}`);

      setUser((prev) => ({ ...prev!, imageUrl: "" }));
      dispatch(setImageUrl(""));

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast.error(data.message, {
          id: "toast",
        });
      } else {
        toast.error("Something went wrong", {
          id: "toast",
        });
      }

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {(isLoading || !user) && <Loader />}

      <ProfileContent
        role="user"
        user={user}
        register={register}
        errors={errors}
        handleName={handleName}
        handlePassword={handlePassword}
        handleImageUpload={handleImageUpload}
        handleImageRemove={handleImageRemove}
      />
    </>
  );
};

export default ProfileContainer;
