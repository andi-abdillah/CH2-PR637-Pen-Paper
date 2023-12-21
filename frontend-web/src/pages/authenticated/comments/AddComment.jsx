import React, { useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import TextArea from "../../../components/TextArea";
import { API_URL } from "../../../api/api";
import axios from "axios";

const AddComment = ({ articleId, setComments, showAlert }) => {
  const { token, user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    userId: user.userId,
    articleId,
    comment: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      const result = await axios.post(`${API_URL}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, status, data } = result.data;

      setComments((prevComments) => [...prevComments, data.comment]);

      setFormData({
        userId: user.userId,
        articleId,
        comment: "",
      });

      showAlert(message, status);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg"
      >
        <TextArea
          id="comment"
          name="comment"
          placeholder="Insert comment here"
          className="border-0"
          value={formData?.comment || ""}
          onChange={handleInputChange}
          cols="30"
          rows="6"
        ></TextArea>

        <PrimaryButton
          type="submit"
          className="self-end my-4"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              Sending
              <Icon className="animate-spin">progress_activity</Icon>
            </>
          ) : (
            <>
              Send
              <Icon>task_alt</Icon>
            </>
          )}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default AddComment;
