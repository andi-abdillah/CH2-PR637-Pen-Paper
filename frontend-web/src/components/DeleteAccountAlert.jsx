import { useAuth } from "../provider/AuthContext";
import { useAlert } from "../provider/AlertProvider";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TextInput from "./TextInput";
import axios from "axios";

const DeleteAccountAlert = ({
  token,
  userId,
  isOpen,
  onClose,
  formData,
  setFormData,
  navigate,
}) => {
  const { logout } = useAuth();

  const { showAlert } = useAlert();

  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async () => {
    try {
      const result = await axios.delete(
        `http://localhost:9000/users/${userId}`,
        {
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, status } = result.data;

      showAlert(message, status);

      logout();

      onClose();

      navigate("/");
    } catch (error) {
      const { message, status } = error.response.data;

      showAlert(message, status);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/30">
      <div className="modal-box shadow-xl">
        <h2 className="mb-4 font-bold text-lg text-red-500">
          Are you sure you want to delete your account?
        </h2>
        <h3>
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Please enter your password to confirm you would
          like to permanently delete your account.
        </h3>
        <TextInput
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="border-0 my-3 font-semibold"
          value={formData.password}
          onChange={handleInputChange}
          isFocused
          required
        />
        <div className="modal-action">
          <PrimaryButton onClick={handleConfirmDelete}>Confirm</PrimaryButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountAlert;
