import { CircleUserRound, Eye, EyeClosed, ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { ProfileContentProps } from "../types";
import ImageUpload from "./ImageUpload";

const ProfileContent = ({
  role,
  user,
  register,
  errors,
  handleName,
  handlePassword,
  handleImageUpload,
  handleImageRemove,
}: ProfileContentProps) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    setIsVisible(false);

    handleImageRemove();
  };

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center bg-gray-800 z-10 max-w-6xl mx-auto p-8 sm:p-10 rounded-lg">
      {/* Image Section */}
      <div className="relative mb-9 lg:mb-0 lg:mr-9">
        <div
          className="relative w-36 sm:w-50 mx-auto border-2 border-white rounded-full group overflow-hidden cursor-pointer"
          onClick={() => setIsVisible(!isVisible)}
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <CircleUserRound className="text-white w-36 sm:w-50 h-auto" />
          )}

          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <ImagePlus className="text-white w-8 h-8" />
          </div>
        </div>

        {/* Image Overlay Actions */}
        <div
          className={`${
            isVisible ? "block" : "hidden"
          } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-lg flex flex-col items-center gap-2 z-10`}
        >
          <h1 className="text-white text-center uppercase text-sm">Image</h1>

          <button
            type="button"
            className="text-xs px-2 py-1 text-white bg-blue-600 hover:bg-blue-800 transition-all rounded-full cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {user?.imageUrl ? "Update" : "Add"}
          </button>

          {user?.imageUrl && (
            <button
              type="button"
              className="text-xs px-2 py-1 text-white bg-blue-600 hover:bg-blue-800 transition-all rounded-full cursor-pointer"
              onClick={handleRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-white lg:pl-5 pt-5 lg:pt-0">
        <form className="flex flex-col text-white gap-y-5">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-base sm:text-xl font-extralight">
              Name:
            </label>
            <input
              {...register?.("name")}
              type="text"
              className="border-b-2 border-white outline-none text-lg sm:text-2xl bg-transparent"
              placeholder="Enter name"
              onBlur={handleName}
            />
            {errors?.name && (
              <small className="text-red-500 font-light mt-1">
                {errors?.name.message}
              </small>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-base sm:text-xl font-extralight">
              Email:
            </label>
            <input
              {...register?.("email")}
              type="text"
              disabled
              className="border-b-2 border-white outline-none text-lg sm:text-2xl truncate cursor-not-allowed text-white/50 bg-transparent"
            />
          </div>

          {role === "user" && (
            <>
              {/* Current Password */}
              <div className="flex flex-col">
                <label className="text-base sm:text-xl font-extralight">
                  Current Password:
                </label>
                <div className="relative w-full">
                  <input
                    {...register("currentPassword")}
                    autoComplete="off"
                    type={showPassword1 ? "text" : "password"}
                    placeholder="Enter password"
                    className="border-b-2 border-white outline-none text-lg sm:text-2xl bg-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => setShowPassword1((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword1 ? (
                      <Eye size={20} />
                    ) : (
                      <EyeClosed size={20} />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <small className="text-red-500 font-light mt-1">
                    {errors.currentPassword.message}
                  </small>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col">
                <label className="text-base sm:text-xl font-extralight">
                  New Password:
                </label>
                <div className="relative w-full">
                  <input
                    {...register?.("password")}
                    autoComplete="off"
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Enter password"
                    className="border-b-2 border-white outline-none text-lg sm:text-2xl bg-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => setShowPassword2((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword2 ? (
                      <Eye size={20} />
                    ) : (
                      <EyeClosed size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <small className="text-red-500 font-light mt-1">
                    {errors.password.message}
                  </small>
                )}
              </div>
              {/* Change password button */}
              <button
                type="button"
                className="bg-blue-600 text-sm sm:text-base rounded-full py-2 hover:bg-blue-800 transition-all cursor-pointer mt-1"
                onClick={handlePassword}
              >
                Change Password
              </button>
            </>
          )}
        </form>
      </div>

      <ImageUpload
        handleImageUpload={handleImageUpload}
        inputRef={inputRef}
        setIsVisible={setIsVisible}
      />
    </main>
  );
};

export default ProfileContent;
