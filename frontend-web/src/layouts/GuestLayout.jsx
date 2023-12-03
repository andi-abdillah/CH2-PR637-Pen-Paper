import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthContext";
import { AlertProvider } from "../provider/AlertProvider";

const GuestLayout = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    if (authenticatedUser) {
      navigate("/dashboard");
    }
  }, [authenticatedUser, navigate]);

  if (authenticatedUser) {
    return null;
  }

  return (
    <AlertProvider>
      <Outlet />
    </AlertProvider>
  );
};

export default GuestLayout;
