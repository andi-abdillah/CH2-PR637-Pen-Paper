import { useState } from "react";
import InputLabel from "../../../components/InputLabel";
import Alert from "../../../components/Alert";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const EditUserPassword = ({ userData, setUserData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
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

    try {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        showAlert(
          "Current password, new password and confirm password are required",
          "error"
        );
        setIsProcessing(false);
        return;
      }

      await axios.put(
        `http://localhost:9000/users/${userData.userId}/password`,
        formData
      );

      setUserData((prevUser) => ({
        ...prevUser,
        password: formData.newPassword,
        updateAt: new Date(),
      }));

      setIsProcessing(false);
    } catch (error) {
      console.error("Error saving new password:", error);
      showAlert("Error saving new password. Please try again later.", "error");
      setIsProcessing(false);
    }
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
        <InputLabel htmlFor="currentPassword" value="Current Password" />
        <TextInput
          id="currentPassword"
          name="currentPassword"
          type="text"
          defaultValue={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Current Password"
          autoComplete="current-password"
          required
        />

        <InputLabel htmlFor="newPassword" value="New Password" />
        <TextInput
          id="newPassword"
          name="newPassword"
          type="text"
          defaultValue={formData.newPassword}
          onChange={handleInputChange}
          placeholder="New Password"
          autoComplete="new-password"
          required
        />

        <InputLabel htmlFor="confirmPassword" value="Password" />
        <TextInput
          id="confirmPassword"
          name="confirmPassword"
          type="text"
          defaultValue={formData.password}
          onChange={handleInputChange}
          placeholder="Confirm Password"
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
