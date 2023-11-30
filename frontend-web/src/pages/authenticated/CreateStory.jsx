import { useState } from "react";
import TextInput from "../../components/TextInput";
import Divider from "../../components/Divider";
import TextArea from "../../components/TextArea";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import { Helmet, HelmetProvider } from "react-helmet-async";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import Alert from "../../components/Alert";

const CreateStory = () => {
  const { authenticatedUser } = useAuth();

  const userId = authenticatedUser.userId;

  const [isProcessing, setIsProcessing] = useState(false);

  const [alert, setAlert] = useState(null);

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

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    if (!formData.title || !formData.content) {
      showAlert("Title and content cannot be empty", "error");
      setIsProcessing(false);
      return;
    }

    try {
      await axios.post("http://localhost:9000/articles", {
        userId: formData.userId,
        title: formData.title,
        content: formData.content,
      });

      setIsProcessing(false);
      navigate("/dashboard/your-stories");
    } catch (error) {
      console.error("Error publishing story:", error);
      showAlert("Error publishing story. Please try again later.", "error");
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

      {alert && (
        <Alert
          type={alert.type}
          onClose={handleCloseAlert}
          message={alert.message}
        />
      )}

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
            rows="20"
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
