import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import Divider from "../../../components/Divider";
import ProfileHeader from "../../../components/ProfileHeader";
import { API_URL } from "../../../api/api";
import axios from "axios";

const YourStories = () => {
  const { token, user } = useAuth();

  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/users/id/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const foundUser = result.data.data.user;
        setUserData(foundUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, [token, userData.userId]);

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Your Stories – Pen & Paper</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">Your Stories</h1>
        <Divider />

        <ProfileHeader {...userData} />

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default YourStories;
