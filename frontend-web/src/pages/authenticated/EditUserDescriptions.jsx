import React, { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import Icon from "../../components/Icon";
import InputLabel from "../../components/InputLabel";
import TextArea from "../../components/TextArea";
import Alert from "../../components/Alert";
import axios from "axios";

const EditUserDescriptions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    descriptions: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          onClose={handleCloseAlert}
          message={alert.message}
        />
      )}

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
