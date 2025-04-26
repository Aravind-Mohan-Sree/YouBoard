import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Signin from "../pages/admin/Signin";
import Dashboard from "../pages/admin/Dashboard";
import AddUser from "../pages/admin/AddUser";
import EditUser from "../pages/admin/EditUser";

const adminRoutes = [
  {
    path: "",
    element: <Navigate to={"/admin/signin"} />,
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "dashboard",
    element: <ProtectedRoute requestRole="admin" />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "add-user",
    element: <ProtectedRoute requestRole="admin" />,
    children: [
      {
        path: "",
        element: <AddUser />,
      },
    ],
  },
  {
    path: "edit-user/:userId",
    element: <ProtectedRoute requestRole="admin" />,
    children: [
      {
        path: "",
        element: <EditUser />,
      },
    ],
  },
];

export default adminRoutes;
