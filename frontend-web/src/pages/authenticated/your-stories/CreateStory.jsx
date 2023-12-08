import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../provider/AuthContext";
import { useAlert } from "../../../provider/AlertProvider";
import BackButton from "../../../components/BackButton";
import TextInput from "../../../components/TextInput";
import Editor from "../../../components/Editor";
import Divider from "../../../components/Divider";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const CreateStory = () => {
  const { token, user } = useAuth();

  const { showAlert } = useAlert();

  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: user.userId,
    title: "",
    descriptions: "",
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
      const result = await axios.post(
        "http://localhost:9000/articles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, status } = result.data;

      showAlert(message, status);

      navigate("/dashboard/your-stories");
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  console.log(formData);

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
            type="text"
            placeholder="Add title"
            className="border-0 my-3 font-semibold"
            defaultValue={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            minLength={10}
            isFocused
            required
          />

          <Divider />

          <TextInput
            id="descriptions"
            name="descriptions"
            type="text"
            placeholder="Add descriptions"
            className="border-0 my-3 font-semibold"
            defaultValue={formData.descriptions}
            onChange={handleInputChange}
            maxLength={250}
            minLength={10}
            required
          />

          <Divider />

          <Editor formData={formData} handleChange={handleInputChange} />

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
