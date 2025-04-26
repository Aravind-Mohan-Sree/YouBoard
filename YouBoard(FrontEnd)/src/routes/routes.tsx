import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/layout";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import Error from "../pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [...userRoutes],
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [...adminRoutes],
  },
  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
