import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import Divider from "../../../components/Divider";

const MyProfile = () => {
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Profile</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">Profile</h1>

        <Divider />

        <Outlet />
      </div>
    </div>
  );
};

export default MyProfile;
