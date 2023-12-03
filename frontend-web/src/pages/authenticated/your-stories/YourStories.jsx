import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import Divider from "../../../components/Divider";
import axios from "axios";
import ProfileHeader from "../../../components/ProfileHeader";

const YourStories = () => {
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
          <title>Your Stories</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">Your Stories</h1>
        <Divider />

        <ProfileHeader {...user} />

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default YourStories;
