import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleRegisterButton = ({ setFormData }) => {
  const handleOnSuccess = (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    setFormData({
      username: decodedToken.name,
      email: decodedToken.email,
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center">
      <GoogleLogin onSuccess={handleOnSuccess} />
    </div>
  );
};

export default GoogleRegisterButton;
