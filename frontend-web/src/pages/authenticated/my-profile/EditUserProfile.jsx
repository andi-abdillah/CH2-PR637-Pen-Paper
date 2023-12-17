import { useEffect, useState } from "react";
import InputLabel from "../../../components/InputLabel";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import { API_URL } from "../../../api/api";
import axios from "axios";

const EditUserProfile = ({
  token,
  userId,
  userData,
  setUserData,
  showAlert,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
    });
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "username" ? value.toLowerCase() : value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await axios.put(
        `${API_URL}/users/${userId}/profile`,
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
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        updateAt: new Date(),
      }));
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg mt-3"
      >
        <InputLabel htmlFor="fullname" value="Full Name" />
        <TextInput
          id="fullname"
          name="fullName"
          type="text"
          defaultValue={formData?.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />

        <InputLabel htmlFor="username" value="Username" />
        <TextInput
          id="username"
          name="username"
          type="text"
          value={formData?.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />

        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          defaultValue={formData?.email}
          onChange={handleInputChange}
          placeholder="Email"
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
