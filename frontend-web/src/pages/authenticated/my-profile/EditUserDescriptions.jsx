import { useEffect, useState } from "react";
import InputLabel from "../../../components/InputLabel";
import TextArea from "../../../components/TextArea";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import { API_URL } from "../../../api/api";
import axios from "axios";

const EditUserDescriptions = ({
  token,
  userId,
  userData,
  setUserData,
  showAlert,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    descriptions: "",
  });

  useEffect(() => {
    setFormData({
      descriptions: userData.descriptions,
    });
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await axios.put(
        `${API_URL}/users/${userId}/descriptions`,
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
        descriptions: formData.descriptions,
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
        <InputLabel htmlFor="descriptions" value="Descriptions" />
        <TextArea
          id="descriptions"
          name="descriptions"
          placeholder="Insert descriptions here"
          className="border-0"
          value={formData?.descriptions || ""}
          onChange={handleInputChange}
          cols="30"
          rows="10"
        ></TextArea>

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

export default EditUserDescriptions;
