import { CircleUserRound, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import api from "../api/axios";
import { resetAuth } from "../store/authSlice";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, userId, imageUrl } = useSelector(
    (store: RootState) => store.auth,
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignout = async () => {
    try {
      const res = await api.delete(
        `${location.pathname.includes("admin") ? "/admin/signout" : "/signout"}`,
      );

      dispatch(resetAuth());

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast.error(data.message, {
          id: "toast",
        });
      }

      console.log(error);
    }
  };

  return (
    <header className="w-full text-white px-4 sm:px-10 py-6 flex justify-between items-start mb-5">
      {/* Brand */}
      <Link
        to={!location.pathname.includes("admin") ? "/home" : "/admin/dashboard"}
      >
        <h1 className="relative inline-block after:block after:h-1.5 after:w-1/3 after:bg-blue-500 after:mt-2 after:rounded-full text-4xl md:text-5xl font-extrabold">
          YouBoard
          {location.pathname.includes("admin") && (
            <span className="absolute text-sm -bottom-1 -right-2 uppercase inline-block">
              admin
              <span className="absolute -bottom-0.5 -right-1 w-[11px] h-[3px] bg-blue-600" />
              <span className="absolute -bottom-0.5 -right-[7px] w-[3px] h-[14px] bg-blue-600" />
            </span>
          )}
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        {isAuthenticated && (
          <>
            {!location.pathname.includes("admin") && (
              <span className="z-10">
                <Link to={`/profile/${userId}`}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-10 rounded-full object-cover border-2"
                    />
                  ) : (
                    <CircleUserRound
                      size={40}
                      className="border-2 rounded-full"
                    />
                  )}
                </Link>
              </span>
            )}
            <button
              type="button"
              className="p-2 px-4 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer z-10 transition-all"
              onClick={handleSignout}
            >
              Signout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      {isAuthenticated && (
        <button
          className="md:hidden z-10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={34} /> : <Menu size={34} />}
        </button>
      )}

      {/* Mobile Dropdown */}
      {menuOpen && isAuthenticated && (
        <div className="absolute top-16 right-4 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-3 w-40 z-100 md:hidden">
          {!location.pathname.includes("admin") && (
            <span onClick={() => setMenuOpen(!menuOpen)}>
              <Link to={`/profile/${userId}`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-10 rounded-full object-cover border-2"
                  />
                ) : (
                  <CircleUserRound
                    size={40}
                    className="border-2 rounded-full"
                  />
                )}
              </Link>
            </span>
          )}
          <button
            type="button"
            className="p-2 px-4 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer z-10 transition-all"
            onClick={() => {
              setMenuOpen(!menuOpen);
              handleSignout();
            }}
          >
            Signout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
