import { useState } from "react";
import InputLabel from "../../../components/InputLabel";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const EditUserPassword = ({
  token,
  userId,
  userData,
  setUserData,
  showAlert,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await axios.put(
        `http://localhost:9000/users/${userId}/password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status } = result.data;

      showAlert(message, status);

      setUserData((prevUser) => ({
        ...prevUser,
        password: formData.newPassword,
        updateAt: new Date(),
      }));

      setIsProcessing(false);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);

      setIsProcessing(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg mt-3"
      >
        <InputLabel htmlFor="currentPassword" value="Current Password" />
        <TextInput
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Current Password"
          autoComplete="current-password"
          required
        />

        <InputLabel htmlFor="newPassword" value="New Password" />
        <TextInput
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="New Password"
          autoComplete="new-password"
          required
        />

        <InputLabel htmlFor="confirmPassword" value="Confirm Password" />
        <TextInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
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
