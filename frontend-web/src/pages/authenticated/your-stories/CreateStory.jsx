import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../provider/AuthContext";
import { useAlert } from "../../../provider/AlertProvider";
import BackButton from "../../../components/BackButton";
import TextInput from "../../../components/TextInput";
import Divider from "../../../components/Divider";
import TextArea from "../../../components/TextArea";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const CreateStory = () => {
  const { authenticatedUser } = useAuth();

  const { setResponse } = useAlert();

  const userId = authenticatedUser.userId;

  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId,
    title: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      const result = await axios.post("http://localhost:9000/articles", {
        userId: formData.userId,
        title: formData.title,
        content: formData.content,
      });

      const successMessage = result.data;

      setResponse({
        status: successMessage.status,
        message: successMessage.message,
      });

      setIsProcessing(false);
      navigate("/dashboard/your-stories");
    } catch (error) {
      console.error("Error publishing story:", error);
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
      <HelmetProvider>
        <Helmet>
          <title>Create A Story</title>
        </Helmet>
      </HelmetProvider>

      <BackButton />

      <h2 className="mx-2 my-6 text-2xl text-primary font-semibold">
        Create a story
      </h2>

      <div className="px-6 py-2 border-[1.2px] border-gray-400 rounded-2xl">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col text-sm xs:text-lg"
        >
          <TextInput
            id="title"
            name="title"
            placeholder="Add title"
            className="border-0 my-3 font-semibold"
            defaultValue={formData.title}
            onChange={handleInputChange}
            isFocused
            required
          />

          <Divider />

          <TextArea
            id="content"
            name="content"
            placeholder="Write here"
            className="border-0 mt-3"
            defaultValue={formData.content}
            onChange={handleInputChange}
            cols="30"
            rows="15"
            required
          ></TextArea>

          <PrimaryButton
            type="submit"
            className="self-end my-4"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                Publishing
                <Icon className="animate-spin">progress_activity</Icon>
              </>
            ) : (
              <>
                Publish
                <Icon>task_alt</Icon>
              </>
            )}
          </PrimaryButton>
        </form>
      </div>
    </>
  );
};

export default CreateStory;
