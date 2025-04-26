import { useEffect } from "react";
import UserSigninForm from "../../components/UserSigninForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  return <UserSigninForm />;
};

export default Signin;
