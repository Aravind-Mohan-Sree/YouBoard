import { useSelector } from "react-redux";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { useEffect } from "react";

const ForgotPassword = () => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  return <ForgotPasswordForm />;
};

export default ForgotPassword;
