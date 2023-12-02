import { useEffect, useState } from "react";
import Alert from "../../../components/Alert";
import InputLabel from "../../../components/InputLabel";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const EditUserProfile = ({ userData, setUserData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      username: userData.username,
      email: userData.email,
    });
  }, [userData]);

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
      if (!formData.username || !formData.email) {
        showAlert("Username and email are required", "error");
        setIsProcessing(false);
        return;
      }

      await axios.put(
        `http://localhost:9000/users/${userData.userId}/profile`,
        formData
      );

      setUserData((prevUser) => ({
        ...prevUser,
        username: formData.username,
        updateAt: new Date(),
      }));

      setIsProcessing(false);
    } catch (error) {
      console.error("Error saving username and email:", error);
      showAlert(
        "Error saving username and email. Please try again later.",
        "error"
      );
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
        <InputLabel htmlFor="username" value="Username" />
        <TextInput
          id="username"
          name="username"
          type="username"
          defaultValue={formData.username}
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
          defaultValue={formData.email}
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
