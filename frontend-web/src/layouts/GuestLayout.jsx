import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const GuestLayout = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    if (loggedInUser) {
      navigate("/dashboard");
    }
  }, [loggedInUser, navigate]);

  if (loggedInUser) {
    return null;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default GuestLayout;
