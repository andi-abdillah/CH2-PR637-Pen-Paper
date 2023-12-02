import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import BackButton from "../../../components/BackButton";
import Alert from "../../../components/Alert";
import TextInput from "../../../components/TextInput";
import Divider from "../../../components/Divider";
import TextArea from "../../../components/TextArea";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import axios from "axios";

const EditStory = () => {
  const { id } = useParams();

  const { authenticatedUser } = useAuth();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/articles/${id}`
        );

        const foundArticle = response.data.data.article;

        if (foundArticle.userId !== authenticatedUser.userId || !foundArticle)
          navigate("/dashboard/your-stories");

        setFormData({
          title: foundArticle.title,
          content: foundArticle.content,
        });
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchData();
  }, [id, authenticatedUser.userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    if (!formData.title || !formData.content) {
      showAlert("Title and content cannot be empty", "error");
      setIsProcessing(false);
      return;
    }

    try {
      await axios.put(`http://localhost:9000/articles/${id}`, {
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
          <title>Edit Story</title>
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
        Edit Story
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
            defaultValue={formData.title}
            onChange={handleInputChange}
            className="border-0 my-3 font-semibold"
            required
          />

          <Divider />

          <TextArea
            id="content"
            name="content"
            placeholder="Write here"
            defaultValue={formData.content}
            onChange={handleInputChange}
            className="border-0 mt-3"
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

export default EditStory;
