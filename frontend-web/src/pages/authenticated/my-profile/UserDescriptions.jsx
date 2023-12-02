import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../auth/AuthContext";
import Loading from "../../../components/Loading";
import SecondaryButton from "../../../components/SecondaryButton";
import Icon from "../../../components/Icon";
import ProfileHeader from "../../../components/ProfileHeader";

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
      <ProfileHeader {...user} />

      <div className="mt-8">
        <SecondaryButton onClick={() => navigate("edit")}>
          Manage Profile<Icon>manage_accounts</Icon>
        </SecondaryButton>

        <p className="md:text-xl font-semibold mt-8">
          {user.descriptions ? user.descriptions : "No descriptions yet"}
        </p>
      </div>
    </>
  );
};

export default UserDescriptions;
