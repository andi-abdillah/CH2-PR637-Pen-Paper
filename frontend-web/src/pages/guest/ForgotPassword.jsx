import { Helmet, HelmetProvider } from "react-helmet-async";
import TextInput from "../../components/TextInput";
import { useState } from "react";
import { useAlert } from "../../provider/AlertProvider";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import axios from "axios";

const ForgotPassword = () => {
  const { showAlert } = useAlert();

  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await axios.post(
        "http://localhost:9000/reset-password",
        formData
      );

      const { message, status } = result.data;

      showAlert(message, status);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  console.log(formData);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
      </HelmetProvider>

      <div className="flex justify-center w-screen min-h-screen bg-primary">
        <div className="mx-6 my-auto p-8 md:p-16 bg-neutral-50 rounded-3xl drop-shadow-card">
          <div className="w-full sm:max-w-xs mx-auto">
            <h2 className="mb-8 text-justify">
              Forgot your password? No problem. Just let us know your email
              address and we will email you a new password that will allow you
              to login to your account.
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="text-center"
                required
                isFocused
              />
              <PrimaryButton type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    Sending Email
                    <Icon className="animate-spin">progress_activity</Icon>
                  </>
                ) : (
                  "Send Email"
                )}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
