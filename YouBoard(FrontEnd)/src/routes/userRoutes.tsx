import { Navigate } from "react-router-dom";
import Signin from "../pages/user/Signin";
import Signup from "../pages/user/Signup";
import Home from "../pages/user/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../pages/user/ForgotPassword";
import Profile from "../pages/user/Profile";

const userRoutes = [
  {
    path: "",
    element: <Navigate to={"/signin"} />,
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "home",
    element: <ProtectedRoute requestRole="user" />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "profile/:userId",
    element: <ProtectedRoute requestRole="user" />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },
];

export default userRoutes;
