import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import AdminSigninForm from "../../components/AdminSigninForm";

const Signin = () => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  return <AdminSigninForm />;
};

export default Signin;
