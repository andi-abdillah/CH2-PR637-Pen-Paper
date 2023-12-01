import { useState } from "react";
import Alert from "../../components/Alert";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import axios from "axios";

const EditUserPassword = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
        <InputLabel htmlFor="current password" value="Current Password" />
        <TextInput
          id="current password"
          name="current password"
          type="current password"
          defaultValue={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Current Password"
          autoComplete="current-password"
          required
        />

        <InputLabel htmlFor="new password" value="New Password" />
        <TextInput
          id="new password"
          name="new password"
          type="new password"
          defaultValue={formData.newPassword}
          onChange={handleInputChange}
          placeholder="New Password"
          autoComplete="new-password"
          required
        />

        <InputLabel htmlFor="password" value="Password" />
        <TextInput
          id="password"
          name="password"
          type="password"
          defaultValue={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          autoComplete="new-password"
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

export default EditUserPassword;
