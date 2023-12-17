import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_URL } from "../api/api";

const GoogleSignInButton = ({ login, showAlert, navigate }) => {
  const handleOnSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        credential: credentialResponse,
      });

      const { message, status, token } = response.data;

      login(token);

      showAlert(message, status);

      navigate("/dashboard");
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <GoogleLogin onSuccess={handleOnSuccess} />
    </div>
  );
};

export default GoogleSignInButton;
