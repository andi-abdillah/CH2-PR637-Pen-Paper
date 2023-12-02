import { useEffect, useState } from "react";
import InputLabel from "../../../components/InputLabel";
import TextArea from "../../../components/TextArea";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const EditUserDescriptions = ({ userData, setUserData, setResponse }) => {
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
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await axios.put(
        `http://localhost:9000/users/${userData.userId}/descriptions`,
        formData
      );
      const successMessage = result.data;
      console.log(successMessage);

      setResponse({
        status: successMessage.status,
        message: successMessage.message,
      });

      setUserData((prevUser) => ({
        ...prevUser,
        descriptions: formData.descriptions,
        updateAt: new Date(),
      }));

      setIsProcessing(false);
    } catch (error) {
      console.error("Error saving descriptions:", error);
      const errorMessage = error.response.data;
      setResponse({
        status: errorMessage.status,
        message: errorMessage.message,
      });
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
          defaultValue={formData.descriptions}
          onChange={handleInputChange}
          cols="30"
          rows="10"
          required
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
