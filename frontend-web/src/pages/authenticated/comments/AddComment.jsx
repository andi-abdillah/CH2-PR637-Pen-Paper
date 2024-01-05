import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import PrimaryButton from "../../../components/PrimaryButton";
import DangerButton from "../../../components/DangerButton";
import Icon from "../../../components/Icon";
import TextArea from "../../../components/TextArea";
import { API_URL } from "../../../api/api";
import axios from "axios";

const AddComment = ({
  articleId,
  parentId = null,
  mentionedUserId = null,
  mentionedUsername,
  isReplying,
  setIsReplying,
  setComments,
  showAlert,
  isProcessing,
  setIsProcessing,
}) => {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    userId: user.userId,
    articleId,
    comment: "",
    parentId,
    mentionedUserId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsReplying(false);
    setFormData({
      ...formData,
      comment: "",
      parentId: null,
      mentionedUserId: null,
    });
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

      setFormData((prevData) => ({
        ...prevData,
        comment: "",
      }));

      setIsReplying(false);

      showAlert(message, status);
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      parentId,
      mentionedUserId,
    }));
  }, [parentId, mentionedUserId, mentionedUsername]);

  console.log(formData);

  return (
    <div id="addcomment">
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col text-sm xs:text-lg"
      >
        <TextArea
          id="comment"
          name="comment"
          placeholder={
            isReplying
              ? `Replying to ${
                  mentionedUsername === user.username
                    ? "your comment"
                    : mentionedUsername
                }`
              : `Insert comment here`
          }
          className="border-0"
          value={formData.comment}
          onChange={handleInputChange}
          cols="30"
          rows="6"
          required
        />
        <div className="flex justify-end gap-2 my-4">
          {(formData.comment || isReplying) && (
            <DangerButton type="button" onClick={handleCancel}>
              Cancel <Icon>cancel</Icon>
            </DangerButton>
          )}
          <PrimaryButton type="submit" disabled={isProcessing}>
            {isProcessing && formData.comment ? (
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
        </div>
      </form>
    </div>
  );
};

export default AddComment;
