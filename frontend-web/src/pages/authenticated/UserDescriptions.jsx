import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icon";
import PrimaryButton from "../../components/PrimaryButton";

const UserDescriptions = () => {
  const { authenticatedUser } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      {authenticatedUser.descriptions ? (
        <p className="md:text-xl font-semibold">{authenticatedUser.descriptions}</p>
      ) : (
        <PrimaryButton onClick={() => navigate("descriptions/create")}>
          Add descriptions<Icon>description</Icon>
        </PrimaryButton>
      )}
    </>
  );
};

export default UserDescriptions;
