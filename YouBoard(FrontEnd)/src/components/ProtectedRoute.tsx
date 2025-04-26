import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ProtectedRouteProps } from "../types";
import { isAxiosError } from "axios";

const ProtectedRoute = ({ requestRole }: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const [currentRole, setCurrentRole] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post(
          `${requestRole === "user" ? "/check-auth" : "/admin/check-auth"}`,
        );

        setCurrentRole(res.data.currentRole);
      } catch (err) {
        if (isAxiosError(err)) {
          setCurrentRole(err.response?.data.currentRole);
        }

        console.log(err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [requestRole, location.key]);

  if (checkingAuth) return null;

  return isAuthenticated ? (
    requestRole === currentRole ? (
      <Outlet />
    ) : (
      <Navigate
        to={currentRole === "user" ? "/home" : "/admin/dashboard"}
        replace
      />
    )
  ) : (
    <Navigate
      to={currentRole === "user" ? "/signin" : "/admin/signin"}
      replace
    />
  );
};

export default ProtectedRoute;
