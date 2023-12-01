import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icon";
import PrimaryButton from "../../components/PrimaryButton";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import axios from "axios";
import SecondaryButton from "../../components/SecondaryButton";

const UserDescriptions = () => {
  const { authenticatedUser } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/users/${authenticatedUser.userId}`
        );

        const foundUser = response.data.data.user;

        setUser(foundUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticatedUser.userId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {user.descriptions ? (
        <>
          <SecondaryButton onClick={() => navigate("edit")}>
            Edit Profile<Icon>manage_accounts</Icon>
          </SecondaryButton>

          <p className="md:text-xl font-semibold mt-8">{user.descriptions}</p>
        </>
      ) : (
        <PrimaryButton onClick={() => navigate("descriptions/create")}>
          Add descriptions<Icon>description</Icon>
        </PrimaryButton>
      )}
    </>
  );
};

export default UserDescriptions;
