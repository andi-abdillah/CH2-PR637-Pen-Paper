import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/sign-in");
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="mx-6 my-12 md:mx-20">
        <Outlet />
      </div>
    </>
  );
};

export default AuthenticatedLayout;
