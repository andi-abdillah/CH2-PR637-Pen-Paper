import { useAlert } from "../provider/AlertProvider";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { API_URL } from "../api/api";
import axios from "axios";

const StoryDeleteAlert = ({ token, isOpen, onClose, navigate, slug }) => {
  const { showAlert } = useAlert();

  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async () => {
    try {
      const result = await axios.delete(
        `${API_URL}/articles/${slug}`,
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
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/30">
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
