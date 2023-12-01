import { useState } from "react";
import Alert from "../../components/Alert";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import axios from "axios";

const EditUserProfile = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
  };
  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          onClose={handleCloseAlert}
          message={alert.message}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg mt-3"
      >
        <InputLabel htmlFor="username" value="Username" />
        <TextInput
          id="username"
          name="username"
          type="username"
          defaultValue={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Username"
          autoComplete="username"
          required
        />

        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          defaultValue={formData.newPassword}
          onChange={handleInputChange}
          placeholder="Email"
          autoComplete="email"
          required
        />

        <PrimaryButton
          type="submit"
          className="self-end my-4"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              Saving
              <Icon className="animate-spin">progress_activity</Icon>
            </>
          ) : (
            <>
              Save
              <Icon>task_alt</Icon>
            </>
          )}
        </PrimaryButton>
      </form>
    </>
  );
};

export default EditUserProfile;
