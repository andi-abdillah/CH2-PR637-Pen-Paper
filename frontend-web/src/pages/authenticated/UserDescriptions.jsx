import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icon";
import PrimaryButton from "../../components/PrimaryButton";

const UserDescriptions = () => {
  const { loggedInUser } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      {loggedInUser.descriptions ? (
        <p className="md:text-xl font-semibold">{loggedInUser.descriptions}</p>
      ) : (
        <PrimaryButton onClick={() => navigate("descriptions/create")}>
          Add descriptions<Icon>description</Icon>
        </PrimaryButton>
      )}
    </>
  );
};

export default UserDescriptions;
