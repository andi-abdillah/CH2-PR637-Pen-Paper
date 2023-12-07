import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DangerButton from "../../../components/DangerButton";
import DeleteAccountAlert from "../../../components/DeleteAccountAlert";

const DeleteUser = ({ token, userId }) => {
  const [alertOpen, setAlertOpen] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
  });

  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setFormData({
      password: "",
    });
    setAlertOpen(false);
  };

  return (
    <div>
      <DeleteAccountAlert
        token={token}
        userId={userId}
        isOpen={alertOpen}
        onClose={closeAlert}
        formData={formData}
        setFormData={setFormData}
        navigate={navigate}
      />
      <DangerButton onClick={openAlert} className="my-6">
        Delete Account
      </DangerButton>
    </div>
  );
};

export default DeleteUser;
