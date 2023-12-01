import { Helmet, HelmetProvider } from "react-helmet-async";
import Divider from "../../components/Divider";
import { useAuth } from "../../auth/AuthContext";
import { Outlet } from "react-router-dom";
import { dateFormater } from "../../utils/dateFormater";
import { useEffect, useState } from "react";
import axios from "axios";

const MyProfile = () => {
  const { authenticatedUser } = useAuth();

  const [user, setUser] = useState({});

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
      }
    };

    fetchData();
  }, [authenticatedUser.userId]);

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

        <div className="text-lg px-3 xs:px-8 py-8 font-semibold">
          <h2 className="capitalize">{user.username}</h2>
          <h2 className="text-primary">
            Joined since {dateFormater(user.createdAt)}
          </h2>
        </div>

        <Divider />

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
