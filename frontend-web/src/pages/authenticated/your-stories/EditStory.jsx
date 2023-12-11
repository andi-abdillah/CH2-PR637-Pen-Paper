import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../provider/AuthContext";
import { useAlert } from "../../../provider/AlertProvider";
import BackButton from "../../../components/BackButton";
import TextInput from "../../../components/TextInput";
import Editor from "../../../components/Editor";
import Divider from "../../../components/Divider";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import axios from "axios";

const EditStory = () => {
  const { token, user } = useAuth();

  const { slug } = useParams();

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/articles/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const foundArticle = response.data.data.article;

        if (foundArticle.userId !== user.userId || !foundArticle)
          navigate("/dashboard/your-stories");

        setFormData({
          title: foundArticle.title,
          descriptions: foundArticle.descriptions,
          content: foundArticle.content,
        });
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, user.userId, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      const result = await axios.put(
        `http://localhost:9000/articles/${slug}`,
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${slug} | Edit | Pen & Paper`}</title>
        </Helmet>
      </HelmetProvider>

      <BackButton />

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
            type="text"
            placeholder="Add title"
            defaultValue={formData?.title}
            onChange={handleInputChange}
            className="border-0 my-3 font-semibold"
            required
          />

          <Divider />

          <TextInput
            id="descriptions"
            name="descriptions"
            type="text"
            placeholder="Add descriptions"
            className="border-0 my-3 font-semibold"
            defaultValue={formData?.descriptions}
            onChange={handleInputChange}
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

export default EditStory;
