import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../auth/AuthContext";
import EditUserDescriptions from "./EditUserDescriptions";
import EditUserPassword from "./EditUserPassword";
import EditUserProfile from "./EditUserProfile";
import { useState } from "react";
import BackButton from "../../components/BackButton";

const EditUserProfileLayout = () => {
  const { authenticatedUser } = useAuth();

  const [user, setUser] = useState({});

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Update Profile</title>
        </Helmet>
      </HelmetProvider>

      <BackButton />

      <div className="flex flex-col gap-6">
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Profile Information
          </h2>

          <h3>Update your account's profile information and email address.</h3>

          <EditUserProfile />
        </div>
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Update Password
          </h2>

          <h2>
            Ensure your account is using a long, random password to stay secure.
          </h2>

          <EditUserPassword />
        </div>
        <div className="px-6 border-[1.2px] border-gray-400 rounded-2xl">
          <h2 className="mt-4 mb-1 md:text-xl text-primary font-semibold">
            Update Descriptions
          </h2>
          <h3>
            Enhance your account's profile by updating the descriptions. Provide
            meaningful and informative details for a better user experience.
          </h3>

          <EditUserDescriptions />
        </div>
      </div>
    </>
  );
};

export default EditUserProfileLayout;
