import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

const GoogleSignInButton = ({ login, showAlert, navigate }) => {
  const handleOnSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://localhost:9000/auth/google", {
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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center">
        <GoogleLogin
          onSuccess={handleOnSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignInButton;
