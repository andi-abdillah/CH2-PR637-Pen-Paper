import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AlertProvider } from "../provider/AlertProvider";
import { useAuth } from "../provider/AuthContext";
import { useEffect } from "react";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    if (!authenticatedUser) {
      navigate("/sign-in");
    }
  }, [authenticatedUser, navigate]);

  if (!authenticatedUser) {
    return null;
  }

  return (
    <AlertProvider>
      <Navbar />
      <div className="mx-6 my-12 md:mx-20">
        <Outlet />
      </div>
    </AlertProvider>
  );
};

export default AuthenticatedLayout;
