import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../../provider/AuthContext";
import { useEffect, useState } from "react";
import { useAlert } from "../../../provider/AlertProvider";
import BackButton from "../../../components/BackButton";
import EditUserDescriptions from "./EditUserDescriptions";
import EditUserPassword from "./EditUserPassword";
import EditUserProfile from "./EditUserProfile";
import ProfileHeader from "../../../components/ProfileHeader";
import Loading from "../../../components/Loading";
import axios from "axios";

const EditUserProfileLayout = () => {
  const { authenticatedUser } = useAuth();

  const { setResponse } = useAlert();

  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundUser = await axios.get(
          `http://localhost:9000/users/${authenticatedUser.userId}`
        );

        const userData = foundUser.data.data.user;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticatedUser.userId, user.updateAt]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl">
      <HelmetProvider>
        <Helmet>
          <title>Update Profile</title>
        </Helmet>
      </HelmetProvider>

      <ProfileHeader {...user} />

      <BackButton />

      <div className="flex flex-col gap-6">
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Profile Information
          </h2>

          <h3>Update your account's profile information and email address.</h3>

          <EditUserProfile
            userData={user}
            setUserData={setUser}
            setResponse={setResponse}
            key={user.updateAt}
          />
        </div>
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Update Password
          </h2>

          <h2>
            Ensure your account is using a long, random password to stay secure.
          </h2>

          <EditUserPassword
            userData={user}
            setUserData={setUser}
            setResponse={setResponse}
            key={user.updateAt}
          />
        </div>
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Update Descriptions
          </h2>

          <h3>
            Enhance your account's profile by updating the descriptions. Provide
            meaningful and informative details for a better user experience.
          </h3>

          <EditUserDescriptions
            userData={user}
            setUserData={setUser}
            setResponse={setResponse}
            key={user.updateAt}
          />
        </div>
      </div>
    </div>
  );
};

export default EditUserProfileLayout;
