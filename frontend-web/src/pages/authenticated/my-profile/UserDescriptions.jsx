import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import Loading from "../../../components/Loading";
import Icon from "../../../components/Icon";
import ProfileHeader from "../../../components/ProfileHeader";
import Divider from "../../../components/Divider";
import { API_URL } from "../../../api/api";
import axios from "axios";

const UserDescriptions = () => {
  const { token, user } = useAuth();

  const navigate = useNavigate();

  const [userData, setUserData] = useState(user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/id/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const foundUser = response.data.data.user;

        setUserData(foundUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user.userId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <ProfileHeader {...userData} />

      <div className="flex flex-col mt-8">
        <div className="self-end dropdown dropdown-end">
          <label tabIndex={0}>
            <Icon className="text-4xl cursor-pointer">more_horiz</Icon>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] p-5 text-center font-semibold drop-shadow-card bg-base-100 rounded-box w-max list-none"
          >
            <li className="mb-2 cursor-pointer hover:text-primary">
              <button
                onClick={() => navigate("edit")}
                className="flex justify-between gap-2 w-full"
              >
                Manage Profile<Icon>manage_accounts</Icon>
              </button>
            </li>
            <Divider />
            <li className="my-2 cursor-pointer hover:text-primary">
              <button
                onClick={() => navigate("/dashboard/bookmarks")}
                className="flex justify-between gap-2 w-full"
              >
                Bookmarks<Icon>bookmarks</Icon>
              </button>
            </li>
            <Divider />
            <li className="mt-2 cursor-pointer hover:text-primary">
              <button
                onClick={() => navigate("/dashboard/liked-articles")}
                className="flex justify-between gap-2 w-full"
              >
                Liked Articles<Icon>favorite</Icon>
              </button>
            </li>
          </ul>
        </div>

        <p className="md:text-xl font-semibold mt-8">
          {userData.descriptions
            ? userData.descriptions
            : "No descriptions yet"}
        </p>
      </div>
    </>
  );
};

export default UserDescriptions;
