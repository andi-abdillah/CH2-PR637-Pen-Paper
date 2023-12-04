import { useAlert } from "../provider/AlertProvider";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import axios from "axios";

const StoryDeleteAlert = ({ token, isOpen, onClose, navigate, articleId }) => {
  const { showAlert } = useAlert();

  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async () => {
    try {
      const result = await axios.delete(
        `http://localhost:9000/articles/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, status } = result.data;

      showAlert(message, status);

      onClose();

      navigate("/dashboard/your-stories");
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-box shadow-xl">
        <h3 className="m-4 font-bold text-lg text-red-500">
          Are you sure you want to delete this article?
        </h3>
        <div className="modal-action">
          <PrimaryButton onClick={handleConfirmDelete}>Confirm</PrimaryButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default StoryDeleteAlert;
