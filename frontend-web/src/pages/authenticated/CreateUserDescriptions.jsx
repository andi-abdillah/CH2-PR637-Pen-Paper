import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import TextArea from "../../components/TextArea";
import BackButton from "../../components/BackButton";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../auth/AuthContext";

const CreateUserDescriptions = () => {
  const { loggedInUser } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  console.log(loggedInUser.descriptions);

  useEffect(() => {
    if (loggedInUser.descriptions) {
      navigate("/dashboard/my-profile");
    }
  }, [loggedInUser.descriptions, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/dashboard/my-profile");
    }, 2000);
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Add Descriptions</title>
        </Helmet>
      </HelmetProvider>
      <BackButton />

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
