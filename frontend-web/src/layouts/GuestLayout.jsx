import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Outlet />
    </GoogleOAuthProvider>
  );
};

export default GuestLayout;
