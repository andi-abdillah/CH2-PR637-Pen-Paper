import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import axios from "axios";

const DeleteAlert = ({ isOpen, onClose, navigate, articleId }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/articles/${articleId}`);

      onClose();

      navigate("/dashboard/your-stories");
    } catch (error) {
      console.error("Error deleting article:", error);
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

export default DeleteAlert;
