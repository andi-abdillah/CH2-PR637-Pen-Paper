import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const DeleteAlert = ({ isOpen, onClose, navigate }) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = () => {
    onClose();
    navigate("/dashboard/your-stories");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-box shadow-xl">
        <h3 className="m-4 font-bold text-lg text-red-500">
          Are you sure want to delete this article?
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
