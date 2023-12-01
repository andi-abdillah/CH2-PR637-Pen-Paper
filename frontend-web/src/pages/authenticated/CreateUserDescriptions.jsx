import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import TextArea from "../../components/TextArea";
import BackButton from "../../components/BackButton";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../auth/AuthContext";
import Alert from "../../components/Alert";
import axios from "axios";

const CreateUserDescriptions = () => {
  const { authenticatedUser } = useAuth();
  const [user, setUser] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundUser = await axios.get(
          `http://localhost:9000/users/${authenticatedUser.userId}`
        );

        const userData = foundUser.data.data.user;
        setUser(userData);
        localStorage.setItem("authenticatedUser", JSON.stringify(userData));

        setFormData(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();

    if (user.descriptions) {
      navigate("/dashboard/my-profile");
    }
  }, [authenticatedUser.userId, navigate, user.descriptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!formData.descriptions) {
        showAlert("Descriptions required", "error");
        setIsProcessing(false);
        return;
      }

      await axios.put(`http://localhost:9000/users/${user.userId}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        descriptions: formData.descriptions,
      });

      localStorage.setItem("authenticatedUser", JSON.stringify(formData));
      setIsProcessing(false);
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("Error publishing descriptions:", error);
      showAlert(
        "Error publishing descriptions. Please try again later.",
        "error"
      );
      setIsProcessing(false);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Add Descriptions</title>
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
        Add descriptions
      </h2>

      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg"
      >
        <TextArea
          id="descriptions"
          name="descriptions"
          placeholder="Insert descriptions here"
          className="border-0 mt-3"
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
    </>
  );
};

export default CreateUserDescriptions;
