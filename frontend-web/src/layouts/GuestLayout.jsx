import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
    <>
      <Outlet />
    </>
  );
};

export default GuestLayout;
