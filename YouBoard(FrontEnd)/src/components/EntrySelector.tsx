import { useLocation, useNavigate } from "react-router-dom";

const EntrySelector = () => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const navigate = useNavigate();

  const handleEntry = (entry: string) => {
    if (entry === "signin") return navigate("/signin");

    return navigate("/signup");
  };

  return (
    <div className=" bg-gray-700 rounded-full mb-5">
      <button
        className={`${
          currentRoute.includes("signin")
            ? "bg-blue-600"
            : "hover:bg-gray-100/10"
        } px-6 py-2 transition-all text-white rounded-full font-medium cursor-pointer`}
        onClick={() => handleEntry("signin")}
      >
        Signin
      </button>
      <button
        className={`${
          currentRoute.includes("signup")
            ? "bg-blue-600"
            : "hover:bg-gray-100/10"
        } px-6 py-2 text-white font-medium cursor-pointer rounded-full transition-all`}
        onClick={() => handleEntry("signup")}
      >
        Signup
      </button>
    </div>
  );
};

export default EntrySelector;
