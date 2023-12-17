import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import PrimaryButton from "../../../components/PrimaryButton";
import Loading from "../../../components/Loading";
import { API_URL } from "../../../api/api";
import axios from "axios";

const ExploreAccount = () => {
  const { token, user } = useAuth();

  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(null);

  const [usersList, setUsersList] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const foundUsers = await axios.get(
            `${API_URL}/users/search?query=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const usersData = foundUsers.data.data.users;

          setUsersList(usersData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setUsersList([]);
    }
  }, [token, searchQuery, user.userId]);

  useEffect(() => {
    setSearchQuery(searchParams.get("query"));
  }, [searchParams]);

  if (loading && searchQuery) {
    return <Loading />;
  }

  if (usersList?.length === 0 && searchQuery) {
    return (
      <p>
        We couldn't find any accounts matching "<b>{searchQuery}</b>".
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {usersList?.map((user, index) => (
        <Link
          to={`/dashboard/profile/@${user.username}`}
          key={index}
          className="w-max"
        >
          <PrimaryButton>{user.username}</PrimaryButton>
        </Link>
      ))}
    </div>
  );
};

export default ExploreAccount;
