import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Background from "../components/Background";
import { Toaster } from "sonner";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900">
      <Background />
      <Header />
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster
        position="bottom-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            width: "fit-content",
          },
        }}
      />
    </div>
  );
};

export default Layout;
