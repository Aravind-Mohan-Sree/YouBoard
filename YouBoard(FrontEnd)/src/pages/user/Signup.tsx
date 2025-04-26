import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/SignupForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect } from "react";

const Signup = () => {
  const { isAuthenticated } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  return <SignupForm />;
};

export default Signup;
