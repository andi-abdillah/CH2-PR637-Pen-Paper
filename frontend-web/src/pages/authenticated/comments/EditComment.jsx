import { useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import PrimaryButton from "../../../components/PrimaryButton";
import DangerButton from "../../../components/DangerButton";
import Icon from "../../../components/Icon";
import TextArea from "../../../components/TextArea";
import axios from "axios";

const EditComment = ({ comment, showAlert, onClose }) => {
  const { token } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    comment: comment.comment,
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
      const result = await axios.put(
        `http://localhost:9000/comments/${comment.commentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, status } = result.data;

      showAlert(message, status);

      setFormData({
        comment: "",
      });

      onClose();
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/30">
      <div className="modal-box shadow-xl">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col text-sm xs:text-lg"
        >
          <TextArea
            id="comment"
            name="comment"
            className="border-0"
            value={formData?.comment || ""}
            onChange={handleInputChange}
            cols="30"
            rows="5"
          ></TextArea>
          <div className="flex justify-end gap-3 mt-4">
            <DangerButton type="button" className="self-end" onClick={onClose}>
              Cancel <Icon>cancel</Icon>
            </DangerButton>
            <PrimaryButton
              type="submit"
              className="self-end"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  Updating
                  <Icon className="animate-spin">progress_activity</Icon>
                </>
              ) : (
                <>
                  Update
                  <Icon>task_alt</Icon>
                </>
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditComment;
