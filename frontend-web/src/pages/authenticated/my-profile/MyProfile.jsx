import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../../provider/AuthContext";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Divider from "../../../components/Divider";
import { API_URL } from "../../../api/api";
import axios from "axios";

const MyProfile = () => {
  const { token, user } = useAuth();

  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/users/id/${user.userId}`,
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
  }, [token, user.userId, userData.updateAt]);
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{`${userData.fullName} on Pen & paper`}</title>
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
